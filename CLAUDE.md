# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other agents when working in this repository.

## What this is

**BOBO** — "Social Commerce OS for African SMBs." A livestream/social-commerce app built for African infrastructure reality: offline-first, mobile-first, bandwidth-aware, latency-tolerant. BOBO is an **app**; its backend source of truth is the **Yaatal Engine** (a separate Rust repo), reached through the typed `@yaatal/client` SDK. Keep backend business logic in the Engine, not here.

BOBO's product role is the **Marketplace** surface of Yaatal: the Engine's `/l/{session}/{product}` livestream deep-links 302 into BOBO's `/i` item pages, which render from the Engine's public catalog.

## Branch reality (important — do not assume `main`)

- **`main` is frozen** (~2026-01-13) on an older stack (PowerSync + PocketBase + Supabase, no Engine wiring). It is **not** the trunk.
- **`codex/bobo-engine-netlify-integration` is the real trunk** — auth/products/orders/analytics/notifications already run on the Engine via the SDK. Base new work on it, not on `main`.

## Stack

| Layer | Technology |
|---|---|
| App | React Native 0.76 + Expo 54 (`bobo-app/`) |
| State | Zustand |
| Offline | PowerSync + SQLite |
| Backend | **Yaatal Engine** via `@yaatal/client` |
| Legacy (migrating off) | PocketBase (delivery + chat only) |
| Package manager | pnpm `10.18.2` (node ≥ 18) |

## Monorepo layout

```
BOBO/
├── bobo-app/                   # Expo app (screens, app-level services, PowerSync)
├── packages/
│   ├── core/  (@njooba/core)   # types, utils, and the Engine-backed services
│   ├── client/ (@yaatal/client)# the SDK, currently workspace-vendored (see guardrails)
│   ├── ai/                     # voice synthesis / image services
│   └── shared/                 # formatCFA, formatPhone, validators
```

pnpm workspace globs: `packages/*`, `bobo-app`.

## The Engine runtime path (how the app talks to the backend)

- `packages/core/src/services/engine.client.ts` owns the `@yaatal/client` instance (`createYaatalClient`, default base URL from `EXPO_PUBLIC_ENGINE_API_URL`), the auth-token lifecycle, and a low-level `engineRequest` helper.
- Engine-backed services: `auth.service.engine.ts`, `products.service.engine.ts`, `orders.service.engine.ts`, `analytics.service.engine.ts`, `notifications.service.engine.ts`, `catalog.service.engine.ts` (public marketplace catalog + live-sessions).
- `packages/core/src/services/index.ts` is the **barrel** — it re-exports the active Engine services under their canonical names. Import services from `@njooba/core`, not from the individual files.
- **Still on PocketBase (mid-migration):** `delivery.service.ts` and `chat.service.ts`. Porting delivery to the Engine (`client.delivery`, delivery codes, `/d/{code}` confirm, escrow release) is the next major item.

## Build / run / test

```bash
pnpm install                 # workspace install (builds the vendored @yaatal/client via its prepare)
pnpm dev                     # expo start (bobo-app)
pnpm build                   # expo export -p web  → bobo-app/dist
pnpm --filter bobo-app type-check
pnpm --filter bobo-app test
```

- **Engine for local dev:** run the Engine (`cargo run -p yaatal-api`, binds `:5150`) or point `EXPO_PUBLIC_ENGINE_API_URL` at a deployed instance (`https://engine.njooba.com`). Auth-gated calls need a bearer token from the Engine's `POST /api/auth/login`; catalog/browse is public.
- **Web deploy:** builds `bobo-app` to `bobo-app/dist`. Cloudflare **Pages** serves it; a `wrangler.toml` also serves the same export as a Cloudflare **Workers** PWA (SPA via `not_found_handling`; the Pages-style `_redirects` is stripped from the Workers build to avoid a redirect loop).

## Conventions & guardrails

- **One `@yaatal/client` identity.** There must be exactly one resolution. It is currently the **workspace-vendored `packages/client`** (`workspace:*`), because github/npm pins don't resolve in the offline build path. This vendored copy is a hand-synced **fork of the canonical `Yaatal-labs/Yaatal-SDK`** — the tracked follow-up is to publish `@yaatal/client` to npm and delete the vendored copy. Never allow two resolutions (a stale duplicate previously mis-built on the web export).
- **Don't reach for PocketBase/Supabase for new work.** Supabase has been removed. PocketBase remains only for delivery + chat until those port to the Engine; don't add new PocketBase collections.
- **App-agnostic backend logic belongs in the Engine**, not in BOBO. BOBO-specific commerce surfaces (checkout/KYC/merchant) are exposed by the Engine's BOBO bridge and consumed here via `client.bobo`.

## Development

Work on a feature branch off the integration trunk (`codex/bobo-engine-netlify-integration`); open PRs against it, not `main`. Keep changes scoped to one item where possible so each is independently reviewable.
