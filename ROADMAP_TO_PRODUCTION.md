# 🚀 Road to Production: NJOOBA & BOBO

**Goal:** Launch a unified African tech ecosystem (Commerce + Dev Community) that works offline and on 2G networks.

---

## Phase 1: The "Iron" Foundation (Weeks 1-2)
*Focus: Data Integrity & Offline Engine*

1.  **PowerSync Integration (CRITICAL)**
    *   [ ] **Mobile :** Implement `powersync-react-native` with SQLite.
    *   [ ] **Web :** Implement `powersync-web` with WASM SQLite.
    *   [ ] **Unified Schema:** Create `packages/db/schema.ts` for consistent data structure.
2.  **Supabase Backend**
    *   [ ] Deploy Postgres schema.
    *   [ ] Configure Row Level Security (RLS) policies.
    *   [ ] Set up Authentication (Phone Auth for BOBO, GitHub/Email for YOKK).

## Phase 2: The "Brain" Integration (Weeks 3-4)
*Focus: AI Agents "Bo"*

1.  **Mobile AI (BOBO)**
    *   [ ] Compile `Qwen2.5-0.5B` via MLC LLM.
    *   [ ] Integrate into React Native for on-device inference.
2.  **Web AI (YOKK)**
    *   [ ] Finalize Vercel Edge Function (`/api/bo/chat`).
    *   [ ] Optimize Prompt Engineering for African Context (as defined in `ProposalModelRs.md`).

## Phase 3: The "Commerce" Layer (Week 5)
*Focus: Money*

1.  **Payments**
    *   [ ] Integrate **Orange Money** & **Wave** APIs (via SenePay or Direct).
    *   [ ] Build "Cash on Delivery" workflow with phone verification.
2.  **Logistics**
    *   [ ] Simple "Pick-up Point" or "Delivery Zone" selector.

## Phase 4: Polish & Performance (Week 6)
*Focus: UX & Speed*

1.  **PWA Audit**
    *   [ ] Achieve 90+ Lighthouse Score on Mobile.
    *   [ ] Verify "Add to Home Screen" flow on Android/iOS.
2.  **2G Optimization**
    *   [ ] Aggressive image compression (Next.js Image / Cloudinary).
    *   [ ] Verify skeletal loading states.

## Phase 5: Launch (Week 7)
*Focus: Go Live*

1.  **Beta:** Soft launch to 50 users in Dakar (YOKK) Then BOBO Followed with expansion(Cote d'Ivoire, Mali, Nigeria, Ghana Rwanda etc).
2.  **Monitoring:** Sentry for errors, PostHog for analytics.
3.  **Public:** Marketing push on ProductHunt/dev.to/X/LinkedIn.

---

**Current Status (Dec 29):** 

UPDATE THE CONTECT BEFORE INITIATING ANY FIX AFTER CODEBASE ANALYSIS
