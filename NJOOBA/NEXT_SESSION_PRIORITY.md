# 🚨 CRITICAL BLOCKER: PocketBase → Supabase Migration

**Created:** 2026-01-06
**Status:** BLOCKING - App won't run until fixed
**Estimated Effort:** 2-3 hours

---

## Problem

BOBO app still has PocketBase code throughout, but we migrated to **Supabase + PowerSync**. App crashes on startup due to missing PocketBase dependency and broken imports.

---

## Files Requiring Migration (8 files)

### Priority 1: Core Services (Fix First)
| File | Current | Action |
|------|---------|--------|
| `src/services/products.service.ts` | Uses PocketBase | Rewrite using PowerSync queries |
| `src/services/chat.service.ts` | Uses PocketBase realtime | Use Supabase realtime + PowerSync |
| `src/services/ai.service.ts` | Uses PocketBase | Use Supabase |

### Priority 2: Screens (Fix After Services)
| File | Current | Action |
|------|---------|--------|
| `src/screens/customer/ProductDetailScreen.tsx` | Imports pocketbase | Use products.service (PowerSync) |
| `src/screens/customer/CheckoutScreen.tsx` | Imports pocketbase | Use orders via PowerSync |
| `src/screens/merchant/ProductsListScreen.tsx` | Imports pocketbase | Use products.service (PowerSync) |
| `src/screens/admin/DeliveryDashboard.tsx` | Imports pocketbase | Use delivery.service (PowerSync) |

### Priority 3: Utilities (Delete or Migrate)
| File | Action |
|------|--------|
| `src/lib/delivery-setup.ts` | Rewrite for Supabase or delete |
| `src/lib/pocketbase.ts` | ✅ DELETED |

---

## Implementation Steps

### Step 1: Verify PowerSync Services Exist
Check `packages/core/src/services/` for PowerSync versions:
```
✅ products.service.powersync.ts
✅ chat.service.powersync.ts  
✅ orders.service.powersync.ts
✅ delivery.service.powersync.ts
✅ auth.service.powersync.ts
```

### Step 2: Update BOBO Service Imports
Replace local services with @njooba/core imports:

**src/services/products.service.ts** → DELETE, use:
```typescript
import { ProductsService, productsService } from '@njooba/core';
```

**src/services/chat.service.ts** → DELETE, use:
```typescript
import { ChatServicePowerSync, chatServicePowerSync } from '@njooba/core';
```

**src/services/ai.service.ts** → DELETE, use:
```typescript
import { AISearchService } from '@njooba/core';
```

### Step 3: Update Screen Imports
For each screen, replace:
```typescript
// OLD
import { pb } from '../lib/pocketbase';
const products = await pb.collection('products').getList();

// NEW
import { usePowerSync } from '@powersync/react-native';
const powerSync = usePowerSync();
const products = await powerSync.getAll('SELECT * FROM products WHERE is_active = 1');
```

### Step 4: Update App.tsx
Remove serviceWorkerRegistration (not needed for RN):
```typescript
// DELETE THIS LINE
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration'
serviceWorkerRegistration.register()
```

### Step 5: Clean Up
```bash
rm -rf src/services/products.service.ts
rm -rf src/services/chat.service.ts
rm -rf src/services/ai.service.ts
rm -rf src/lib/delivery-setup.ts
rm -rf src/serviceWorkerRegistration.ts
```

### Step 6: Reinstall & Test
```bash
cd bobo-app
pnpm install
npx expo start --clear
```

---

## Quick Reference: PowerSync Query Patterns

### Read All
```typescript
const products = await powerSync.getAll<Product>(
  'SELECT * FROM products WHERE merchant_id = ?',
  [merchantId]
);
```

### Read One
```typescript
const product = await powerSync.get<Product>(
  'SELECT * FROM products WHERE id = ?',
  [productId]
);
```

### Watch (Reactive)
```typescript
const { data } = usePowerSyncWatchedQuery<Product>(
  'SELECT * FROM products WHERE is_active = 1'
);
```

### Write (Goes to Supabase)
```typescript
await powerSync.execute(
  'INSERT INTO products (id, title, price) VALUES (?, ?, ?)',
  [uuid(), title, price]
);
```

---

## Supabase Client Setup

Already configured in `src/lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## Environment Variables Required

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_POWERSYNC_URL=https://xxx.powersync.co
```

---

## Verification Checklist

After migration, verify:
- [ ] `pnpm install` completes without errors
- [ ] `npx expo start` launches without crashes
- [ ] Products load on home screen
- [ ] Can create new product (merchant)
- [ ] Can place order (customer)
- [ ] Chat works between buyer/seller
- [ ] Offline mode works (airplane mode test)

---

## Files Already Done ✅

- `src/lib/powersync/schema.ts` - Schema defined
- `src/lib/powersync/service.ts` - PowerSync initialized
- `src/services/livestream.service.ts` - Uses Supabase
- `packages/core/src/services/*` - All PowerSync services ready

---

## Commands to Start Next Session

```bash
# 1. Navigate to project
cd "C:\Users\momo-\OneDrive\Desktop\JOOBAL LLC\NJOOBA"

# 2. Read this file
cat NEXT_SESSION_PRIORITY.md

# 3. Start migration
# Follow steps above
```

---

## Context Files to Read

1. `CLAUDE.md` - Full project context
2. `SESSION_HANDOFF.md` - Previous session work
3. `bobo-app/src/lib/powersync/schema.ts` - Table definitions
4. `packages/core/src/services/index.ts` - Available services
