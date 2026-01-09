# NJOOBA Session Handoff Document
**Last Updated:** 2026-01-06
**Status:** In Progress - App Separation

---

## 🎯 Current Mission
Separating BOBO (social commerce) and YOKK (dev community) into independent apps with minimal shared utilities.

---

## ✅ COMPLETED TASKS

### 1. Schema Separation
- **BOBO Supabase Schema** (`bobo-app/supabase/schema.sql`)
  - 11 commerce tables: profiles, products, orders, order_items, delivery_persons, delivery_requests, livestream_qr_scans, livestream_overlay_state, conversations, messages, reviews
  - Phone-based auth, roles: customer/merchant/delivery/admin
  - Payment: orange_money, wave, cash
  - Full RLS policies

- **BOBO PowerSync Schema** (`bobo-app/src/lib/powersync/schema.ts`)
  - 9 tables synced for offline-first
  - Indexes on key lookup fields

- **YOKK Supabase Schema** (`yokk-app/supabase/schema.sql`)
  - 9 community tables: profiles, posts, comments, upvotes, launches, achievements, bo_conversations, feed_items, bookmarks
  - Username-based auth with gamification (level, xp, streaks)
  - RPC functions for upvote handling

- **YOKK PowerSync Schema** (`yokk-app/lib/powersync/schema.ts`)
  - 8 tables for offline community features

### 2. Shared Utilities Package
- **Location:** `packages/shared/`
- **Contents:**
  - `src/utils/formatters.ts` - formatCFA(), formatPhone(), formatDate()
  - `src/utils/validators.ts` - isValidPhone(), isValidEmail(), isValidUsername()
  - `src/utils/platform.ts` - isWeb(), isNative(), isSlowConnection()
  - `src/types/common.ts` - UserRole, PaymentMethod, OrderStatus, etc.

### 3. BOBO Livestream Migration (Partial)
- **Created:** `bobo-app/src/services/livestream.service.ts`
  - QR generation (generateProductQR, generateStyledQR)
  - Overlay state management (updateOverlayState, hideOverlayQR, subscribeToOverlayState)
  - Analytics (logQRScan, markScanAsConverted, getMerchantAnalytics, getPlatformAnalytics)

- **Created:** `bobo-app/src/screens/merchant/LivestreamControlsScreen.tsx`
  - React Native merchant UI for live sales
  - Platform selector (TikTok, Instagram, Facebook, YouTube)
  - Product grid with QR toggle
  - OBS URL copy/share

---

## 🔄 IN PROGRESS

### OBS Web Overlay
**File to create:** `bobo-app/web/overlay/index.html`

**Purpose:** Standalone HTML page for OBS browser source - displays QR code during livestream

**Key features needed:**
- Transparent background
- Real-time Supabase subscription for overlay state
- Animated QR display with product info
- Auto-hide when QR disabled

**Code template started but interrupted - use this structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Transparent bg, Supabase JS CDN -->
</head>
<body>
  <div id="overlay" class="overlay-container">
    <div class="qr-wrapper">
      <img id="qr-code" />
    </div>
    <div class="product-info">
      <div id="product-title"></div>
      <div id="product-price"></div>
    </div>
  </div>
  <script>
    // Get merchantId from URL: ?merchant=xxx or /overlay/xxx
    // Subscribe to livestream_overlay_state changes
    // Update QR and product info on change
  </script>
</body>
</html>
```

---

## 📋 REMAINING TASKS

### Priority 1: Complete Livestream Migration
1. **Create OBS overlay** (`bobo-app/web/overlay/index.html`)
2. **Create analytics screen** (`bobo-app/src/screens/merchant/LivestreamAnalyticsScreen.tsx`)
   - Show totalScans, conversions, conversionRate
   - Product breakdown with revenue
   - Platform breakdown (TikTok vs Instagram vs Facebook)
   - Date range filter

### Priority 2: Clean Up YOKK
3. **Remove livestream code from YOKK:**
   - Delete `yokk-app/lib/livestream/` folder
   - Delete `yokk-app/components/merchant/LiveControlPanel.tsx`
   - Delete `yokk-app/components/merchant/QROverlay.tsx`
   - Delete `yokk-app/app/merchant/overlay/` folder
   - Remove livestream tables from YOKK schema

### Priority 3: Integration
4. **Add navigation routes in BOBO**
   - Add LivestreamControlsScreen to merchant navigation
   - Add LivestreamAnalyticsScreen to merchant navigation

5. **Install dependencies in BOBO**
   ```bash
   cd bobo-app
   npx expo install qrcode @types/qrcode
   ```

6. **Environment variables**
   - Ensure BOBO has `BOBO_WEB_URL` env var for QR URLs
   - Ensure Supabase credentials are in `@env`

---

## 🏗️ ARCHITECTURE OVERVIEW

```
NJOOBA/
├── bobo-app/                    # React Native + Expo (Social Commerce)
│   ├── src/
│   │   ├── lib/powersync/       # Offline sync schema
│   │   ├── services/
│   │   │   └── livestream.service.ts  ✅ CREATED
│   │   └── screens/merchant/
│   │       ├── LivestreamControlsScreen.tsx  ✅ CREATED
│   │       └── LivestreamAnalyticsScreen.tsx  ❌ TODO
│   ├── supabase/
│   │   └── schema.sql           ✅ CREATED
│   └── web/overlay/
│       └── index.html           ❌ TODO (OBS browser source)
│
├── yokk-app/                    # Next.js 15 PWA (Dev Community)
│   ├── lib/
│   │   ├── powersync/schema.ts  ✅ UPDATED
│   │   └── livestream/          ❌ TODO: DELETE
│   ├── components/merchant/     ❌ TODO: DELETE
│   ├── app/merchant/overlay/    ❌ TODO: DELETE
│   └── supabase/
│       └── schema.sql           ✅ CREATED
│
└── packages/shared/             # Minimal shared utilities
    └── src/
        ├── utils/               ✅ CREATED
        └── types/               ✅ CREATED
```

---

## 🔑 KEY DECISIONS MADE

1. **Phone-based auth for BOBO** (African market standard)
2. **Username-based auth for YOKK** (dev community preference)
3. **CFA (XOF) currency** for all BOBO pricing
4. **Gamification in YOKK only** (level, xp, streaks)
5. **OBS overlay stays as web** (browser source requirement)
6. **Minimal shared package** - only formatters, validators, types

---

## 🚨 WATCH OUT FOR

1. **Supabase types mismatch** - Run `supabase gen types typescript` after schema changes
2. **PowerSync sync rules** - Need to update sync rules in Supabase to match new schema
3. **React Native qrcode** - Use `qrcode` package (works with RN)
4. **Env variables** - BOBO uses `@env` for React Native, YOKK uses `process.env`

---

## 📝 COMMANDS TO RUN

```bash
# After schema changes, regenerate types:
cd bobo-app && supabase gen types typescript --local > src/lib/supabase/types.ts
cd yokk-app && supabase gen types typescript --local > lib/supabase/types.ts

# Install livestream deps in BOBO:
cd bobo-app && npx expo install qrcode

# Apply schema migrations:
cd bobo-app && supabase db push
cd yokk-app && supabase db push
```

---

## 🎯 NEXT AGENT INSTRUCTIONS

1. Read this handoff document
2. Check todo list status with current files
3. Continue from "IN PROGRESS" section
4. Create OBS overlay HTML first (simplest)
5. Then create analytics screen
6. Finally clean up YOKK

**Activate project:** `mcp__plugin_serena_serena__activate_project` with "NJOOBA"
