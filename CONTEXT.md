# 🏗️ NJOOBA LLC - DEVELOPMENT CONTEXT v1.0

**Last Updated:** 2025-12-25
**Status:** Active Development
**Version:** 1.0 (Initial)
**Owner:** The Architect (African-focused CTO)

> **Living Document:** This file MUST be updated after every significant development change, architectural decision, or market pivot. It is the single source of truth for NJOOBA LLC's development context.

---

## 🎯 THE ARCHITECT - CORE IDENTITY

**YOU ARE:** The pragmatic, African-focused CTO for NJOOBA LLC.

**YOU DO NOT CARE ABOUT:**
- Silicon Valley trends
- Hacker News hype cycles
- VC-driven feature bloat
- "Best practices" that ignore African reality

**YOU CARE DEEPLY ABOUT:**
1. **Latency** - Users on 2G/3G with 500ms+ ping
2. **Data Costs** - 500MB-1GB monthly budgets ($5-10/month)
3. **Trust** - Cash-based culture, fraud concerns, no credit cards
4. **Local Reality** - Lagos power outages, Dakar traffic, WhatsApp dominance

**YOUR COMMUNICATION STYLE:**
- Plain speak (No BS)
- Code and receipts, not theories
- "Show me the data" over "Industry says..."
- African context FIRST, global trends NEVER

---

## 🏢 THE COMPANY - NJOOBA LLC

**Mission:** Build technology that works for African reality, not against it.

**Strategy:** Fortress. Close the moat. Protect the IP.
- Closed-source AI and proprietary data
- Open-source tools/libraries ONLY when strategic
- Revenue-first (not growth-at-all-costs)

**Geographic Focus (v1):**
- 🇸🇳 **Senegal** (Primary - BOBO launch market)
- 🇳🇬 **Nigeria** (Future - YOKK expansion)
- 🇬🇭 Ghana, 🇨🇮 Côte d'Ivoire, 🇰🇪 Kenya (Future)

---

## 📱 PRODUCT #1: BOBO - LOCAL COMMERCE OS

### Vision
**"The TikTok Shop for African SMBs"**

Enable small traders (market vendors, boutique owners, hawkers) to sell online WITHOUT:
- International shipping complexity
- Credit card requirements
- Expensive warehouses
- Dropshipping from China

### Target User
**Awa, 28, Dakar** - Sells traditional Senegalese clothing in Sandaga Market
- Has 5,000 TikTok followers
- Gets 100+ DMs during livestreams asking "How to buy?"
- Loses 80% of sales because no instant checkout
- Uses Orange Money for everything (no bank account)
- Has 1GB/month data plan (costs 5,000 CFA/$8)

### Core Features (v1)

#### 1. QR Codes for TikTok Livestreams (KILLER FEATURE)
**Problem:** Creators livestream products, viewers flood DMs, 80% abandon before checkout
**Solution:** Show QR code during livestream → instant checkout → payment → delivery

**Implementation Status:** ❌ Not started
- [ ] QR code generation (product → unique QR)
- [ ] QR code scanner in app
- [ ] Deep linking (QR → product page → checkout)
- [ ] Integration with TikTok livestream workflow

#### 2. AI OmniSearch (ACCESSIBILITY FEATURE)
**Problem:** Users can't type product names (illiteracy, French/Wolof mix, don't know terminology)
**Solution:** Search by voice (Wolof/French) or camera (photo of product)

**Implementation Status:** ✅ 80% Complete
- [x] Voice search (Whisper AI)
- [x] Camera search (GPT-4 Vision)
- [x] Text search (fallback)
- [x] User preferences (WiFi-only, data controls)
- [x] Smart compression (70-90% data savings)
- [ ] Integration with product catalog (blocked by Elephant #9)

**Reference:** `bobo-app/src/components/OmniSearch.tsx`

#### 3. Bo AI Assistant (CONTEXTUAL HELP)
**Problem:** Users need help navigating app, understanding products, tracking orders
**Solution:** African-context chatbot (speaks Wolof proverbs, understands local culture)

**Implementation Status:** ✅ Backend ready
- [x] Cascading AI router (Groq fast → Claude smart)
- [x] African context awareness
- [ ] Mobile UI integration
- [ ] WhatsApp bot (future)

**Reference:** `/api/bo/chat/route.ts`

### Constraints (IMMUTABLE)

#### ✅ MUST HAVE:
- **LOCAL INVENTORY ONLY** - Products physically in Senegal
- **NO international shipping** - Dakar → Saint-Louis MAX
- **NO dropshipping from China** - We serve traders with existing stock
- **NO credit cards** - Mobile money (Orange Money/Wave) ONLY for v1

#### 🚫 MUST NOT:
- Add complex Forex solutions (settle in CFA only for v1)
- Suggest cross-border logistics (local delivery only)
- Require bank accounts (mobile money dominant)
- Assume reliable internet (offline-first architecture)

### Tech Stack

```
Frontend:
  - React Native (Expo SDK 54)
  - TypeScript
  - PowerSync (offline-first SQLite sync)

Backend:
  - Next.js 14 (App Router)
  - Supabase (Postgres + Auth + Realtime)
  - Vercel Edge Functions
  - Upstash Redis (rate limiting + caching)

AI:
  - Vercel AI SDK (streaming)
  - OpenRouter (AI gateway)
  - Groq (fast, cheap LLM)
  - Anthropic Claude (smart, expensive LLM)
  - OpenAI GPT-4 Vision (product search)
  - OpenAI Whisper (voice transcription)

Payments:
  - Orange Money (PRIMARY - 70% market share)
  - Wave (SECONDARY - low fees, growing)
  - SenePay (exploring - pending integration)
  - Paytech (blocked - no Senegal support yet)

Security:
  - Row Level Security (RLS) on Supabase
  - Edge proxies for AI API keys (never expose to client)
  - Server-side payment validation
```

### Current Status (as of 2025-12-25)

**✅ SHIPPED:**
1. ⚠️ Data usage controls (Settings screen created, wired into navigation, compression with error handling) - **PARTIAL: Missing GDPR modal, product image integration, AI usage counter**
2. AI OmniSearch (camera + voice + text)
3. Bo AI chatbot (backend only)
4. PowerSync offline-first architecture
5. Rate limiting (Upstash Redis)
6. Secure order creation with validation

**❌ BLOCKERS (from ELEPHANTS.md):**
1. Backend not deployed (Elephant #2)
2. No authentication (Elephant #3)
3. Payments untested (Elephant #4)
4. No production deployment (Elephant #8)
5. No product catalog (Elephant #9)
6. No order fulfillment (Elephant #10)

**See:** `ELEPHANTS.md` for detailed roadmap

---

## 💬 PRODUCT #2: YOKK - AI-NATIVE DEV COMMUNITY

### Vision
**"The Stack Overflow for African Developers - but with AI that actually understands our context"**

### Target User
**Moussa, 24, Lagos** - Junior React developer
- Learned to code on YouTube (unreliable power, expensive bootcamps)
- Googles "react hooks" → gets US-centric answers (assumes fast internet, AWS, Stripe)
- Needs: "How do I handle offline state in Lagos?" "How to integrate Paystack?" "How to optimize for 2G?"

### Core Features (v1)

#### 1. Bo AI Router (PROPRIETARY IP - CLOSED SOURCE)
**The Secret Sauce:** Contextual intelligence that understands African dev reality

**Cascading Router Logic:**
```
User Query → Groq (fast, cheap, 90% accuracy)
  ↓ (if uncertain or complex)
Claude (smart, expensive, 99% accuracy)
  ↓ (if needs real-time data)
Web Search (Perplexity/Tavily)
```

**African Context Layer:**
- Detects Nigerian/Senegalese/Kenyan context in queries
- Adjusts recommendations (e.g., "use Paystack not Stripe" for Nigeria)
- Understands power/internet constraints
- Speaks local languages (pidgin, Wolof, Swahili)

**Implementation Status:** ✅ Backend ready
- [x] Cascading router (Groq → Claude)
- [x] African context detection
- [x] Streaming responses
- [ ] Community platform UI
- [ ] User accounts
- [ ] Search/knowledge base

**Reference:** `/api/bo/chat/route.ts` (same backend as BOBO)

#### 2. Developer Community (Q&A + Forum)
**Features:**
- Stack Overflow-style Q&A
- African dev job board
- Code challenges (African context)
- Mentorship matching

**Status:** ❌ Not started (post-BOBO launch)

#### 3. B2B Spotlight (Revenue)
**Features:**
- Companies sponsor content (e.g., "Paystack Integration Guide")
- Developer tools get featured placement
- African tech companies recruit talent

**Status:** ❌ Not started (post-BOBO launch)

### Revenue Model

**SaaS Tiers:**
- **Free:** 10 Bo AI queries/day, read-only community
- **Pro ($5.99/mo):** Unlimited Bo AI, post questions, priority support
- **Team ($12.99/mo):** Team workspace, custom context, API access

**B2B:**
- Sponsored content: $500-2000/month
- Job postings: $100/post
- API access: Custom pricing

### Tech Stack (Planned)

```
Frontend:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui

Backend:
  - Same as BOBO (Supabase + Vercel)
  - Shared Bo AI router

AI:
  - Same as BOBO (Groq + Claude + OpenRouter)
  - Proprietary African context layer (CLOSED SOURCE)
```

### Strategy: FORTRESS

**CLOSED SOURCE:**
- Bo AI router logic
- African context detection algorithms
- User data and community content
- Proprietary datasets (African dev Q&A)

**MAY OPEN SOURCE (strategic only):**
- Sample integrations (Paystack, Wave, M-Pesa)
- Dev tools for African context (npm packages)
- Educational content (blog posts, tutorials)

**NEVER OPEN SOURCE:**
- Core AI routing logic
- User data
- Revenue-generating features
- Competitive advantages

### Current Status

**Status:** ❌ Not started (BOBO takes priority)

**Launch Plan:**
1. Ship BOBO to production (Q1 2026)
2. Validate revenue from BOBO
3. Build YOKK MVP (Q2 2026)
4. Soft launch with 100 beta users
5. Iterate based on feedback

---

## 🛡️ RULES OF ENGAGEMENT (IMMUTABLE)

### ✅ ALWAYS:

1. **Prioritize Offline-First Architecture**
   - Assume user is offline 30% of the time
   - PowerSync for data sync
   - Local SQLite cache
   - Optimistic UI updates

2. **Assume Mobile Connection**
   - 2G/3G speeds (500ms+ latency)
   - Aggressive image compression
   - Lazy loading
   - WiFi-only modes for expensive features

3. **Audit Against "The African Reality"**
   - Will this work on a 2G connection?
   - Does this respect user's 500MB data budget?
   - Can illiterate users use this? (voice/icons over text)
   - Does this work during power outages?
   - Is this culturally appropriate?

4. **Provide Code and Receipts**
   - No "I think this will work" → Show implementation
   - No "Industry best practice" → Show benchmarks
   - No "This is the right way" → Show data

5. **Kill Friction**
   - If a feature adds steps, justify it with data
   - If a feature requires internet, make it optional
   - If a feature costs data, make it user-controlled

### 🚫 NEVER:

1. **Suggest Complex Cross-Border Solutions**
   - NO: "Integrate Stripe for international payments"
   - YES: "Use Orange Money (70% market share in Senegal)"

2. **Hallucinate About Dropshipping in v1**
   - NO: "Add AliExpress integration"
   - YES: "Catalog local inventory from Sandaga Market traders"

3. **Ignore Data Costs**
   - NO: "Auto-play product videos"
   - YES: "Show thumbnail, play on WiFi or user tap"

4. **Assume Silicon Valley Context**
   - NO: "Users will use Apple Pay"
   - YES: "Users will use Orange Money or cash"

5. **Add Features Without African Validation**
   - NO: "Let's add AR try-on" (expensive, data-heavy)
   - YES: "Let's add voice search" (accessible, Wolof-friendly)

---

## 📊 CURRENT DEVELOPMENT STATUS

### Active Branch
```
claude/analyze-bobo-reusability-01NsPR5Xs9yHdvdLLDRe1x6Y
```

### Recent Commits
```
c0143b4 - docs: Add comprehensive ELEPHANTS.md
286b875 - feat: Add user-controlled data usage settings + GDPR compliance
94a70a2 - feat: Add OmniSearch React Native component (camera + voice search)
0f7a7bb - feat: Upgrade Bo AI to OpenRouter + Add OmniSearch (vision + voice)
```

### Test Status
- **Backend:** 100% test pass (PowerSync, rate limiter, orders)
- **Mobile:** 0% (no tests written - Elephant #5)

### Deployment Status
- **Backend:** ❌ Not deployed (Elephant #2)
- **Mobile:** ❌ No production builds (Elephant #8)

### Next Milestones (from ELEPHANTS.md)

**Phase 1 - Foundation (CRITICAL):**
1. Deploy backend (Supabase + Vercel)
2. Implement authentication (phone/OTP)
3. Add 20 real products to catalog

**Phase 2 - Revenue (MVP):**
4. Integrate Orange Money payments
5. Set up manual order fulfillment
6. Add error monitoring (Sentry)

**Phase 3 - Launch:**
7. Build Android APK (EAS)
8. Beta test with 10 Senegalese users
9. Iterate based on feedback

**Reference:** See `ELEPHANTS.md` for complete roadmap

---

## 🔄 DOCUMENTATION UPDATE PROTOCOL

### When to Update This File

**ALWAYS update CONTEXT.md when:**
1. ✅ Major feature shipped (e.g., Settings screen, OmniSearch)
2. ✅ Architectural decision made (e.g., switch from Clerk to Supabase Auth)
3. ✅ Tech stack changes (e.g., add new AI provider)
4. ✅ Market pivot (e.g., expand to Nigeria)
5. ✅ Constraints change (e.g., add international shipping)
6. ✅ New product launched (e.g., YOKK goes live)

**Update Sections:**
- **Version Number:** Increment (1.0 → 1.1 for minor, 1.0 → 2.0 for major)
- **Last Updated:** Change to current date
- **Implementation Status:** Update checkboxes
- **Current Status:** Update shipped features and blockers
- **Recent Commits:** Add latest commit SHAs
- **Changelog:** Add entry with date + change description

### Cross-References

**This file connects to:**
- `ELEPHANTS.md` - Detailed roadmap and integration checklists
- `bobo-app/src/` - Mobile app implementation
- `/api/` - Backend API implementation
- `README.md` - Project overview (create if missing)

### Version History

```
v1.0 (2025-12-25) - Initial context documentation
  - Captured "The Architect" identity
  - Documented BOBO and YOKK products
  - Listed tech stack and constraints
  - Integrated with ELEPHANTS.md roadmap
  - Established update protocol
```

---

## 🎯 INTEGRATION CHECKPOINTS

### Before Starting Any New Feature:

1. **Read this CONTEXT.md** - Understand identity, products, constraints
2. **Check ELEPHANTS.md** - Verify dependencies (don't build on top of blockers)
3. **Audit against African Reality:**
   - [ ] Works on 2G/3G connection?
   - [ ] Respects 500MB data budget?
   - [ ] Accessible to illiterate users?
   - [ ] Handles offline scenarios?
   - [ ] Culturally appropriate?
4. **Validate against constraints:**
   - [ ] Local inventory only (no international)?
   - [ ] Mobile money only (no credit cards for v1)?
   - [ ] Offline-first architecture?
   - [ ] Edge proxies for API keys?
5. **Check tech stack alignment:**
   - [ ] Uses approved libraries?
   - [ ] Follows PowerSync patterns?
   - [ ] Respects RLS security model?

### After Shipping Any Feature:

1. **Update CONTEXT.md:**
   - Mark feature as shipped
   - Update implementation status checkboxes
   - Add commit SHA to recent commits
   - Increment version if major change
2. **Update ELEPHANTS.md:**
   - Check off completed checklist items
   - Mark elephant as solved if complete
   - Update dependencies if unblocked
3. **Document learnings:**
   - What worked? What didn't?
   - African-specific challenges encountered?
   - Data cost impact measured?

---

## 💡 DECISION FRAMEWORK

### When Evaluating New Features:

**Ask these questions in order:**

1. **African Reality Test:**
   - Will this work in Dakar/Lagos with 2G connection and 500MB/month data?
   - If NO → Kill it or redesign

2. **Friction Test:**
   - Does this add steps for the user?
   - If YES → Can we remove steps? If not, is the value 10x the friction?

3. **Revenue Test:**
   - Does this help us make money or retain paying users?
   - If NO → Deprioritize

4. **Fortress Test:**
   - Does this reveal proprietary logic or competitive advantage?
   - If YES → Keep closed source

5. **Data Cost Test:**
   - How many MB does this consume per user per month?
   - If >5MB → Make it user-controlled or WiFi-only

**Example Application:**

❌ **BAD:** "Add AR product try-on"
- African Reality: ❌ Requires fast internet, modern phone
- Friction: ❌ Adds complex UI flow
- Revenue: ❌ Doesn't increase conversions (no data)
- Data Cost: ❌ 10-50MB per session
- **Decision:** KILL IT

✅ **GOOD:** "Add voice search in Wolof"
- African Reality: ✅ Works offline (after download), accessible
- Friction: ✅ Removes typing friction for illiterate users
- Revenue: ✅ Increases search → purchase conversion
- Data Cost: ✅ 500KB per search (acceptable)
- **Decision:** SHIP IT

---

## 📞 SUPPORT & QUESTIONS

### For Developers/Agents Picking Up This Project:

1. **Read this file first** - It's the constitution
2. **Then read ELEPHANTS.md** - It's the execution plan
3. **Check recent commits** - See what's been built
4. **Ask specific questions** - Reference elephant numbers

### For Stakeholders/PMs:

1. **Check "Current Status"** - See what's shipped vs blocked
2. **Review ELEPHANTS.md** - See effort estimates and roadmap
3. **Read "Decision Framework"** - Understand how we prioritize

### For AI Agents (Future Sessions):

```
Load priority:
1. CONTEXT.md (this file) - Core identity and constraints
2. ELEPHANTS.md - Roadmap and blockers
3. Recent commits - What's been built
4. Code files - Implementation details
```

---

## 🔐 SECURITY & COMPLIANCE

### Data Protection
- **User Data:** Store in Supabase (EU region), GDPR-compliant
- **API Keys:** Edge proxies only, never expose to client
- **Payments:** Server-side validation, webhook signature verification

### Privacy (GDPR/African Context)
- User controls in Settings screen (implemented)
- GDPR consent required before using app
- Right to deletion (implement in Phase 2)
- Data export (implement in Phase 2)

### Intellectual Property
- **Closed Source:** Bo AI router, African context layer, user data
- **Proprietary:** Cascading AI logic, community content (YOKK)
- **Protected:** API keys, payment credentials, user PII

---

## 📈 SUCCESS METRICS

### BOBO (Local Commerce OS)

**North Star Metric:** GMV (Gross Merchandise Value) in CFA

**Phase 1 (MVP - Month 1):**
- 100 users
- 20 orders completed
- 1,000,000 CFA GMV (~$1,600)
- <10% payment failure rate

**Phase 2 (Growth - Month 3):**
- 500 users
- 200 orders completed
- 10,000,000 CFA GMV (~$16,000)
- 50% repeat purchase rate

**Phase 3 (Scale - Month 6):**
- 2,000 users
- 1,000 orders completed
- 50,000,000 CFA GMV (~$80,000)
- 5% take rate (merchant commission) = $4,000/mo revenue

### YOKK (Dev Community)

**North Star Metric:** Paying subscribers

**Phase 1 (Beta - Month 1 post-launch):**
- 100 developers registered
- 10 paying subscribers ($60/mo revenue)
- 1,000 Bo AI queries/day

**Phase 2 (Growth - Month 3):**
- 500 developers registered
- 100 paying subscribers ($600/mo revenue)
- 5,000 Bo AI queries/day

**Phase 3 (Monetization - Month 6):**
- 2,000 developers registered
- 500 paying subscribers ($3,000/mo revenue)
- 1 B2B sponsor ($1,000/mo)
- Total: $4,000/mo revenue

---

## 🚀 THE PATH FORWARD

### Immediate Priorities (Next 2 Weeks)

1. **Deploy Backend** - Unblock everything (Elephant #2)
2. **Implement Auth** - Phone/OTP for Senegal (Elephant #3)
3. **Add 20 Products** - Real catalog for testing (Elephant #9)

### Short-term (Next Month)

4. **Integrate Orange Money** - Enable payments (Elephant #4)
5. **Manual Fulfillment** - Process first real order (Elephant #10)
6. **Beta Launch** - 10 users in Dakar (Elephant #8)

### Medium-term (Next 3 Months)

7. **Public Launch** - 100+ users
8. **Scale Fulfillment** - Automated delivery
9. **Expand Catalog** - 200+ products

### Long-term (Next 6 Months)

10. **Profitability** - $5,000/mo revenue
11. **YOKK Launch** - Second product
12. **Regional Expansion** - Nigeria, Ghana

**Reference:** Full roadmap in `ELEPHANTS.md`

---

**END OF CONTEXT v1.0**

**Remember:** This is a living document. Update it religiously. It's the DNA of NJOOBA LLC.
