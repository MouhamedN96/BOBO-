# 🎯 African Platforms - Master Implementation Plan

**Goal**: Transform BOBO & NJOOBA into cross-platform ecosystems (Mobile + PWA) with maximum code reusability

**Timeline**: 4 weeks (Dec 23, 2024 - Jan 20, 2025)

**Budget**: $14/month infrastructure

---

## 📊 Current State (Dec 23, 2024)

### ✅ Completed
- [x] BOBO Mobile app (React Native + Expo)
  - [x] Authentication (Login, Signup)
  - [x] Navigation (Merchant, Customer)
  - [x] Products CRUD with QR codes
  - [x] VOD upload (50MB max, 2min)
  - [x] Discovery feed (trending, deals, categories)
  - [x] Product detail with video player
  - [x] QR Scanner (camera-based)
  - [x] AI-powered search (Vercel AI SDK + Groq)
    - [x] Hybrid NLP (local + cloud)
    - [x] Visual search (image recognition)
    - [x] Multi-language (FR/Wolof/EN)
  - [x] PocketBase integration
  - [x] Gamification system
  - [x] Design system ("Sunset Over Dakar")

### 🔄 In Progress
- [ ] PWA configuration (started)
  - [x] app.json web config
  - [x] PWA manifest
  - [x] Platform adapters (native image picker)
  - [ ] Web platform adapters
  - [ ] Service worker
  - [ ] Offline support

### ⏳ Not Started
- [ ] NJOOBA Mobile
- [ ] Monorepo architecture
- [ ] Cross-platform testing
- [ ] Production deployment

---

## 🏗️ Architecture Decision: OPTION C (Hybrid Approach)

**Rationale**: Best balance of speed and scalability

### Week 1: BOBO Complete (Mobile + PWA)
- Day 1-2: Finish BOBO Mobile polish + testing
- Day 3-4: Complete BOBO PWA setup
- Day 5-7: Extract core packages, set up monorepo foundation

### Week 2: Monorepo & Shared Infrastructure
- Day 8-10: Create shared packages (design-system, core-ai, shared-utils)
- Day 11-12: Build platform adapters
- Day 13-14: Deploy BOBO PWA to production

### Week 3: NJOOBA Mobile
- Day 15-17: Extract NJOOBA core from existing web
- Day 18-20: Build NJOOBA mobile screens
- Day 21: Testing & polish

### Week 4: Production Launch
- Day 22-24: Deploy all 4 apps
- Day 25-26: Performance optimization
- Day 27-28: Production monitoring & fixes

---

## 📋 Detailed Execution Plan

## PHASE 1: BOBO Mobile Completion (Days 1-2)

### Day 1: Core Features Polish

#### Morning: Checkout Flow
- [ ] **Task 1.1**: Create CheckoutScreen.tsx
  - [ ] Order summary
  - [ ] Shipping address form
  - [ ] Phone number input (Senegal format)
  - [ ] Payment method selection (Wave, Orange Money, Cash)
  - [ ] Order confirmation
- [ ] **Task 1.2**: Create OrderService
  - [ ] createOrder(product, quantity, shippingInfo)
  - [ ] calculateTotal(product, quantity)
  - [ ] validateOrder(orderData)
- [ ] **Task 1.3**: Update ProductDetail screen
  - [ ] Wire "Buy Now" button to checkout
  - [ ] Pass product data to CheckoutScreen
- [ ] **Task 1.4**: Add to CartStore (Zustand)
  - [ ] addToCart(product)
  - [ ] removeFromCart(productId)
  - [ ] updateQuantity(productId, quantity)
  - [ ] clearCart()

**Agent**: `checkout-builder` (Haiku) - Build checkout flow components

#### Afternoon: Order Management
- [ ] **Task 1.5**: Create OrdersScreen (Merchant)
  - [ ] List all orders by seller
  - [ ] Filter by status (pending, paid, shipped, delivered)
  - [ ] Order detail view
  - [ ] Update order status
- [ ] **Task 1.6**: Create OrdersScreen (Customer)
  - [ ] List customer orders
  - [ ] Order tracking
  - [ ] Order history
- [ ] **Task 1.7**: Add order notifications
  - [ ] New order (merchant)
  - [ ] Order status updates (customer)

**Agent**: `orders-builder` (Haiku) - Build order management screens

---

### Day 2: Testing & Bug Fixes

#### Morning: Unit Tests
- [ ] **Task 2.1**: Test AI services
  - [ ] NLPEngine.parseQuery() - all languages
  - [ ] Price extraction accuracy
  - [ ] Category detection
  - [ ] Wolof translation
- [ ] **Task 2.2**: Test product services
  - [ ] Create product (with/without video)
  - [ ] Update product
  - [ ] Delete product
  - [ ] Search products
- [ ] **Task 2.3**: Test auth flow
  - [ ] Signup validation
  - [ ] Login flow
  - [ ] Token persistence
  - [ ] Logout

**Agent**: `test-runner` (Haiku) - Run all unit tests, report failures

#### Afternoon: Integration Tests
- [ ] **Task 2.4**: E2E merchant flow
  - [ ] Signup as merchant
  - [ ] Add product with photo
  - [ ] Add product with video
  - [ ] View QR code
  - [ ] Update product
- [ ] **Task 2.5**: E2E customer flow
  - [ ] Signup as customer
  - [ ] Browse discovery feed
  - [ ] Search with AI
  - [ ] Visual search
  - [ ] Scan QR code
  - [ ] View product detail
  - [ ] Purchase product
- [ ] **Task 2.6**: Performance testing
  - [ ] App startup time
  - [ ] Search response time (local vs AI)
  - [ ] Video upload speed
  - [ ] Image loading

**Agent**: `integration-tester` (Haiku) - E2E test scenarios

---

## PHASE 2: BOBO PWA Setup (Days 3-4)

### Day 3: Platform Adapters

#### Morning: Web Adapters
- [ ] **Task 3.1**: Create imagePicker.web.ts
  - [ ] pickImage() - HTML file input
  - [ ] pickVideo() - HTML file input with video
  - [ ] takePhoto() - getUserMedia() API
  - [ ] Validate file size/duration
- [ ] **Task 3.2**: Create scanner.web.ts
  - [ ] QR scanner using html5-qrcode
  - [ ] Camera permission handling
  - [ ] Deep link navigation
- [ ] **Task 3.3**: Create storage.web.ts
  - [ ] localStorage wrapper
  - [ ] Same API as AsyncStorage
  - [ ] Fallback to memory storage
- [ ] **Task 3.4**: Update services to use adapters
  - [ ] Import from @/utils/platform/
  - [ ] Remove direct expo-image-picker imports
  - [ ] Test on web

**Agent**: `web-adapter-builder` (Haiku) - Build all web platform adapters

#### Afternoon: PWA Configuration
- [ ] **Task 3.5**: Configure service worker
  - [ ] Cache static assets
  - [ ] Cache API responses
  - [ ] Offline fallback page
  - [ ] Background sync
- [ ] **Task 3.6**: Add install prompt
  - [ ] Detect installability
  - [ ] Custom install banner
  - [ ] Track install events
- [ ] **Task 3.7**: Configure web manifest
  - [ ] Icons (192x192, 512x512)
  - [ ] Splash screens
  - [ ] Shortcuts
  - [ ] Screenshots
- [ ] **Task 3.8**: Add meta tags for SEO
  - [ ] Open Graph tags
  - [ ] Twitter cards
  - [ ] Product schema.org markup

**Agent**: `pwa-configurator` (Haiku) - Set up PWA features

---

### Day 4: Web UI Optimization

#### Morning: Responsive Design
- [ ] **Task 4.1**: Update DiscoveryScreen for web
  - [ ] Desktop layout (grid vs list)
  - [ ] Sidebar filters
  - [ ] Infinite scroll
- [ ] **Task 4.2**: Update ProductDetail for web
  - [ ] Desktop layout (image gallery)
  - [ ] Video player controls
  - [ ] Related products sidebar
- [ ] **Task 4.3**: Update navigation for web
  - [ ] Top nav bar (desktop)
  - [ ] Breadcrumbs
  - [ ] Footer
- [ ] **Task 4.4**: Add keyboard shortcuts
  - [ ] Search (Cmd/Ctrl + K)
  - [ ] Navigate (arrow keys)
  - [ ] Submit forms (Enter)

**Agent**: `responsive-optimizer` (Haiku) - Optimize UI for web

#### Afternoon: Web Testing
- [ ] **Task 4.5**: Test on browsers
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Edge
- [ ] **Task 4.6**: Test PWA features
  - [ ] Install flow
  - [ ] Offline mode
  - [ ] Push notifications
  - [ ] Background sync
- [ ] **Task 4.7**: Lighthouse audit
  - [ ] Performance (target: 90+)
  - [ ] Accessibility (target: 95+)
  - [ ] Best Practices (target: 100)
  - [ ] SEO (target: 100)
  - [ ] PWA (target: 100)

**Agent**: `web-tester` (Haiku) - Cross-browser testing

---

## PHASE 3: Monorepo Setup (Days 5-7)

### Day 5: Extract Shared Code

#### Morning: Create Workspace
- [ ] **Task 5.1**: Initialize Turborepo
  ```bash
  npx create-turbo@latest african-platforms
  cd african-platforms
  ```
- [ ] **Task 5.2**: Create package structure
  ```bash
  mkdir -p packages/{core-ai,design-system,shared-utils,platform-adapters,bobo-core,njooba-core}
  mkdir -p apps/{bobo-mobile,bobo-web,njooba-mobile,njooba-web}
  ```
- [ ] **Task 5.3**: Configure turbo.json
  - [ ] Build pipeline
  - [ ] Dev pipeline
  - [ ] Test pipeline
  - [ ] Lint pipeline
- [ ] **Task 5.4**: Configure root package.json
  - [ ] Workspace setup
  - [ ] Scripts (dev, build, test)
  - [ ] Shared dependencies

**Agent**: `monorepo-architect` (Haiku) - Set up monorepo structure

#### Afternoon: Extract Packages
- [ ] **Task 5.5**: Extract core-ai
  ```bash
  mv bobo-app/src/services/ai.service.ts packages/core-ai/services/
  mv bobo-app/api/ packages/core-ai/api/
  ```
  - [ ] Update imports
  - [ ] Add package.json
  - [ ] Add tsconfig.json
- [ ] **Task 5.6**: Extract design-system
  ```bash
  mv bobo-app/src/theme/ packages/design-system/theme/
  mv bobo-app/src/components/ProductCard.tsx packages/design-system/components/
  ```
  - [ ] Update imports
  - [ ] Make components platform-agnostic
- [ ] **Task 5.7**: Extract shared-utils
  ```bash
  mv bobo-app/src/utils/validation.ts packages/shared-utils/validation/
  mv bobo-app/src/utils/formatters.ts packages/shared-utils/formatters/
  mv bobo-app/src/constants/gamification.ts packages/shared-utils/gamification/
  ```

**Agent**: `package-extractor` (Haiku) - Extract and organize shared code

---

### Day 6: Create BOBO Core Package

#### Morning: Extract Services
- [ ] **Task 6.1**: Move services to bobo-core
  ```bash
  mv bobo-app/src/services/products.service.ts packages/bobo-core/services/
  mv bobo-app/src/services/auth.service.ts packages/bobo-core/services/
  ```
  - [ ] Update PocketBase imports
  - [ ] Add package.json
  - [ ] Export all services
- [ ] **Task 6.2**: Move stores to bobo-core
  ```bash
  mv bobo-app/src/store/ packages/bobo-core/store/
  ```
  - [ ] Update imports in services
  - [ ] Test store persistence
- [ ] **Task 6.3**: Move types to bobo-core
  ```bash
  mv bobo-app/src/types/ packages/bobo-core/types/
  ```

**Agent**: `bobo-core-builder` (Haiku) - Build BOBO core package

#### Afternoon: Platform Adapters Package
- [ ] **Task 6.4**: Create platform-adapters package
  - [ ] camera/scanner.{native,web}.ts
  - [ ] file-picker/picker.{native,web}.ts
  - [ ] storage/storage.{native,web}.ts
  - [ ] notifications/push.{native,web}.ts
- [ ] **Task 6.5**: Add platform detection
  ```typescript
  export * from Platform.select({
    native: () => require('./scanner.native'),
    web: () => require('./scanner.web'),
  })()
  ```
- [ ] **Task 6.6**: Update apps to use adapters
  - [ ] Update bobo-mobile imports
  - [ ] Update bobo-web imports
  - [ ] Test on both platforms

**Agent**: `adapter-builder` (Haiku) - Build platform adapters

---

### Day 7: Migrate Apps to Monorepo

#### Morning: BOBO Mobile Migration
- [ ] **Task 7.1**: Move to apps/bobo-mobile
  ```bash
  mv bobo-app apps/bobo-mobile
  ```
- [ ] **Task 7.2**: Update package.json dependencies
  ```json
  {
    "dependencies": {
      "@workspace/bobo-core": "*",
      "@workspace/design-system": "*",
      "@workspace/platform-adapters": "*",
      "@workspace/core-ai": "*",
      "@workspace/shared-utils": "*"
    }
  }
  ```
- [ ] **Task 7.3**: Update all imports
  - [ ] Replace relative imports with workspace imports
  - [ ] Test build
  - [ ] Test app functionality

**Agent**: `import-updater` (Haiku) - Update all import statements

#### Afternoon: BOBO Web Creation
- [ ] **Task 7.4**: Create bobo-web app
  ```bash
  cd apps
  cp -r bobo-mobile bobo-web
  ```
- [ ] **Task 7.5**: Configure for web
  - [ ] Update app.json
  - [ ] Add web-specific screens
  - [ ] Configure routing
- [ ] **Task 7.6**: Test web build
  ```bash
  cd apps/bobo-web
  expo start --web
  ```
- [ ] **Task 7.7**: Fix web-specific issues
  - [ ] Navigation
  - [ ] Platform adapters
  - [ ] Styling

**Agent**: `web-app-builder` (Haiku) - Create and configure web app

---

## PHASE 4: Testing & Deployment (Days 8-14)

### Day 8-10: Comprehensive Testing

- [ ] **Task 8.1**: Mobile testing
  - [ ] iOS simulator
  - [ ] Android emulator
  - [ ] Physical devices
- [ ] **Task 8.2**: Web testing
  - [ ] Desktop browsers
  - [ ] Mobile browsers
  - [ ] PWA installation
- [ ] **Task 8.3**: Performance testing
  - [ ] Load time
  - [ ] Search speed
  - [ ] Video upload
- [ ] **Task 8.4**: AI testing
  - [ ] Smart search accuracy
  - [ ] Visual search quality
  - [ ] Multi-language support

**Agents**:
- `mobile-tester` (Haiku) - Test on mobile platforms
- `web-tester` (Haiku) - Test on web browsers
- `ai-validator` (Haiku) - Validate AI accuracy

---

### Day 11-12: Deployment Setup

#### BOBO Mobile Deployment
- [ ] **Task 11.1**: Configure EAS Build
  ```bash
  eas build:configure
  ```
- [ ] **Task 11.2**: Build for iOS
  ```bash
  eas build --platform ios
  ```
- [ ] **Task 11.3**: Build for Android
  ```bash
  eas build --platform android
  ```
- [ ] **Task 11.4**: Submit to stores
  - [ ] App Store Connect
  - [ ] Google Play Console

#### BOBO Web Deployment
- [ ] **Task 11.5**: Configure Vercel
  - [ ] vercel.json
  - [ ] Environment variables
  - [ ] Custom domain
- [ ] **Task 11.6**: Deploy to production
  ```bash
  vercel --prod
  ```
- [ ] **Task 11.7**: Configure PWA updates
  - [ ] Service worker update strategy
  - [ ] Version management

#### Vercel AI API Deployment
- [ ] **Task 11.8**: Deploy AI endpoints
  ```bash
  cd packages/core-ai/api
  vercel --prod
  ```
- [ ] **Task 11.9**: Set environment variables
  ```bash
  vercel env add GROQ_API_KEY
  ```
- [ ] **Task 11.10**: Test API endpoints
  - [ ] /api/smart-search
  - [ ] /api/visual-search

**Agent**: `deployment-manager` (Haiku) - Handle deployments

---

### Day 13-14: Production Monitoring

- [ ] **Task 13.1**: Set up analytics
  - [ ] Google Analytics
  - [ ] Vercel Analytics
  - [ ] Custom events
- [ ] **Task 13.2**: Error monitoring
  - [ ] Sentry integration
  - [ ] Error alerts
  - [ ] Performance monitoring
- [ ] **Task 13.3**: Usage tracking
  - [ ] AI search usage
  - [ ] Feature adoption
  - [ ] User flows
- [ ] **Task 13.4**: Database monitoring
  - [ ] PocketBase metrics
  - [ ] Search history analysis
  - [ ] Performance optimization

**Agent**: `monitor-setup` (Haiku) - Configure monitoring tools

---

## PHASE 5: NJOOBA Mobile (Days 15-21)

### Day 15-17: Extract NJOOBA Core

- [ ] **Task 15.1**: Analyze existing NJOOBA web
  - [ ] Identify reusable logic
  - [ ] List services
  - [ ] Map data models
- [ ] **Task 15.2**: Create njooba-core package
  ```bash
  mkdir -p packages/njooba-core/{services,store,types,hooks}
  ```
- [ ] **Task 15.3**: Extract services
  - [ ] articles.service.ts
  - [ ] events.service.ts
  - [ ] jobs.service.ts
  - [ ] discussions.service.ts
- [ ] **Task 15.4**: Create Zustand stores
  - [ ] authStore.ts
  - [ ] communityStore.ts
  - [ ] learningStore.ts

**Agent**: `njooba-extractor` (Haiku) - Extract NJOOBA core

---

### Day 18-20: Build NJOOBA Mobile

- [ ] **Task 18.1**: Create njooba-mobile app
  ```bash
  npx create-expo-app@latest apps/njooba-mobile
  ```
- [ ] **Task 18.2**: Set up navigation
  - [ ] Bottom tabs (Articles, Events, Jobs, Profile)
  - [ ] Stack navigators
- [ ] **Task 18.3**: Build screens
  - [ ] ArticlesList
  - [ ] ArticleDetail
  - [ ] EventsList
  - [ ] JobsList
  - [ ] DiscussionsList
- [ ] **Task 18.4**: Integrate AI search
  - [ ] Use shared core-ai
  - [ ] NJOOBA-specific prompts
  - [ ] Code search

**Agent**: `njooba-mobile-builder` (Haiku) - Build mobile screens

---

### Day 21: Polish & Testing

- [ ] **Task 21.1**: UI polish
  - [ ] Consistent styling
  - [ ] Loading states
  - [ ] Error states
- [ ] **Task 21.2**: Testing
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests
- [ ] **Task 21.3**: Performance
  - [ ] Bundle size optimization
  - [ ] Image optimization
  - [ ] Code splitting

**Agent**: `polish-tester` (Haiku) - Final polish and testing

---

## PHASE 6: Production Launch (Days 22-28)

### Day 22-24: Final Deployments

- [ ] **Task 22.1**: Deploy all apps
  - [ ] BOBO Mobile (iOS + Android)
  - [ ] BOBO Web (PWA)
  - [ ] NJOOBA Mobile (iOS + Android)
  - [ ] NJOOBA Web (existing + updates)
- [ ] **Task 22.2**: Configure domains
  - [ ] bobo.app (web)
  - [ ] njooba.dev (web)
  - [ ] Deep links
- [ ] **Task 22.3**: Set up CDN
  - [ ] Vercel Edge Network
  - [ ] Image optimization
  - [ ] Video CDN

---

### Day 25-26: Performance Optimization

- [ ] **Task 25.1**: Lighthouse audits
  - [ ] All apps 90+ score
  - [ ] Fix issues
- [ ] **Task 25.2**: Load testing
  - [ ] 1000 concurrent users
  - [ ] API stress testing
- [ ] **Task 25.3**: Optimize AI costs
  - [ ] Cache common searches
  - [ ] Tune complexity threshold

---

### Day 27-28: Launch & Monitor

- [ ] **Task 27.1**: Soft launch
  - [ ] Beta testers
  - [ ] Feedback collection
- [ ] **Task 27.2**: Monitor metrics
  - [ ] Error rates
  - [ ] Performance
  - [ ] User engagement
- [ ] **Task 27.3**: Bug fixes
  - [ ] Critical issues
  - [ ] User-reported bugs
- [ ] **Task 27.4**: Documentation
  - [ ] User guides
  - [ ] API docs
  - [ ] Admin guides

---

## 🤖 AI Agents Assignment

### Haiku Agents (Fast, Cost-Effective)

| Agent Name | Role | Tasks | Model |
|------------|------|-------|-------|
| `checkout-builder` | Build checkout flow | Create CheckoutScreen, OrderService, Cart | Haiku |
| `orders-builder` | Build order management | Merchant/Customer order screens | Haiku |
| `test-runner` | Run unit tests | Execute tests, report failures | Haiku |
| `integration-tester` | E2E testing | Full user flow testing | Haiku |
| `web-adapter-builder` | Build web adapters | Image picker, QR scanner for web | Haiku |
| `pwa-configurator` | PWA setup | Service worker, manifest, install | Haiku |
| `responsive-optimizer` | Web UI optimization | Desktop layouts, responsive design | Haiku |
| `web-tester` | Cross-browser testing | Test all browsers, PWA features | Haiku |
| `monorepo-architect` | Monorepo setup | Turborepo config, workspace setup | Haiku |
| `package-extractor` | Extract packages | Move code to shared packages | Haiku |
| `import-updater` | Update imports | Change relative to workspace imports | Haiku |
| `deployment-manager` | Deployments | Deploy apps, configure Vercel | Haiku |
| `monitor-setup` | Monitoring | Analytics, error tracking setup | Haiku |
| `njooba-extractor` | Extract NJOOBA core | Create njooba-core package | Haiku |
| `njooba-mobile-builder` | Build NJOOBA mobile | Screens, navigation, AI integration | Haiku |
| `polish-tester` | Final polish | UI polish, final testing | Haiku |

### Sonnet Agents (Complex Tasks)

| Agent Name | Role | Tasks | Model |
|------------|------|-------|-------|
| `architecture-reviewer` | Review architecture | Code review, best practices | Sonnet |
| `ai-optimizer` | Optimize AI | Improve accuracy, reduce costs | Sonnet |
| `security-auditor` | Security review | Vulnerability scanning, fixes | Sonnet |

---

## 📊 Success Metrics

### Code Quality
- [ ] 90%+ test coverage
- [ ] 0 critical bugs
- [ ] Lighthouse scores 90+
- [ ] Bundle size < 5MB

### Performance
- [ ] App startup < 3s
- [ ] Search response < 500ms
- [ ] Video upload < 30s (10MB)
- [ ] Page load < 2s

### AI Accuracy
- [ ] 95%+ French NLP accuracy
- [ ] 90%+ Wolof translation accuracy
- [ ] 85%+ Visual search relevance
- [ ] 80%+ Price extraction accuracy

### User Engagement
- [ ] 1000+ installs (Week 1)
- [ ] 60%+ retention (Day 7)
- [ ] 30%+ daily active users
- [ ] <5% error rate

---

## 💰 Budget Tracking

| Item | Monthly Cost | Annual Cost |
|------|--------------|-------------|
| PocketBase (DigitalOcean) | $12 | $144 |
| Groq AI (Free tier → Paid) | $0 → $2 | $0 → $24 |
| Vercel Hosting | $0 | $0 |
| Domain (bobo.app) | $1 | $12 |
| **Total** | **$13-15** | **$156-180** |

**Target**: Support 15K users on $15/month

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Performance targets met
- [ ] Security audit complete
- [ ] Documentation ready
- [ ] Analytics configured
- [ ] Error monitoring live
- [ ] Backup strategy tested
- [ ] Rollback plan ready

### Launch Day
- [ ] Deploy to production
- [ ] Verify all endpoints
- [ ] Monitor error rates
- [ ] Check performance
- [ ] Social media announcement
- [ ] Email beta users

### Post-Launch (Week 1)
- [ ] Daily monitoring
- [ ] Bug triage
- [ ] User feedback review
- [ ] Performance optimization
- [ ] Feature requests prioritization

---

## 📝 Notes

- All agents use Haiku model for cost efficiency
- Sonnet reserved for complex reviews only
- Each agent reports progress to main thread
- Failed tasks escalated for manual review
- Weekly sync on Fridays to review progress

---

**Plan Version**: 1.0
**Last Updated**: Dec 23, 2024
**Owner**: Claude + Haiku Agent Team
**Status**: Ready to Execute 🚀
