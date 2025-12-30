# NJOOBA & BOBO Development Plan

## 🌍 Strategic Direction (Updated Dec 2025)

**Vision:** A unified African tech ecosystem.
- **BOBO:** Local Commerce OS (TikTok Shop for Senegal). Offline-first, Mobile Money.
- **NJOOBA/YOKK:** AI-Native Developer Community (Stack Overflow + X + Product Hunt).

**Core Philosophy:** "The Architect"
- **Offline-First:** PowerSync (SQLite <-> Supabase).
- **Latency-Aware:** 2G optimizations.
- **Context-Aware:** Local AI (Bo) that understands Wolof, CFA, and Orange Money.

---

## 📅 Roadmap

### Phase 1: Foundation & Shared Architecture (Current)
- [x] **Monorepo Setup:** `packages/shared`, `packages/webapp`, `bobo-app`.
- [x] **Design System:** "Sunset Over Dakar" (Tailwind + Framer Motion).
- [x] **PWA Shell (NJOOBA):**
  - [x] Hybrid UI (Truth Nav + Bilibili Feed + Product Hunt Sidebar).
  - [x] Offline Service Worker.
  - [x] "Bo" AI Drawer (Grok-style).
  - [x] Gamification Integration (Streaks/Levels).

### Phase 2: Offline Data Engine (Next Priority)
- [ ] **PowerSync Implementation:**
  - [ ] `bobo-app` (React Native): SQLite + PowerSync SDK.
  - [ ] `packages/webapp` (PWA): Wasm SQLite + PowerSync Web SDK.
- [ ] **Unified Schema:** Shared `schema.ts` for Products, Orders, Profiles.
- [ ] **Optimistic UI:** Write-offline capabilities for Posts/Orders.

### Phase 3: AI & Features
- [ ] **"Bo" AI Agent:**
  - [ ] Mobile: On-device Qwen2.5-0.5B (via MLC LLM).
  - [ ] Web: Cloud Hybrid (Groq + Claude).
- [ ] **Commerce Features (BOBO):**
  - [ ] Orange Money Integration.
  - [ ] QR Code Livestream Checkout.

### Phase 4: Launch & Scale
- [ ] **Beta Testing:** Dakar user group (10 users).
- [ ] **Performance Tuning:** Lighthouse scores, bundle size audit.
- [ ] **Deployment:** Vercel (Web) + EAS (Mobile).

---

## 🛠️ Current Status (Dec 29, 2025)

**NJOOBA PWA:**
- UI: **Complete** (Hybrid Layout).
- Offline: **Partial** (Read-only App Shell).
- AI: **UI Only** (Drawer exists, needs backend hookup).

**BOBO Mobile:**
- UI: **In Progress**.
- Offline: **Pending** (PowerSync files need creation).

**Next Step:** Implement PowerSync Core in `packages/shared` or a new `packages/db` to be used by both apps.