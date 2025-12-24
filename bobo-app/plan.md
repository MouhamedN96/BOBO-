# Backend Beta & Testing Plan

## 🎯 Objective
Achieve a **complete, stable backend beta** ("green" status) before transitioning to UI development. This involves fixing the remaining brittle tests, ensuring robust error handling, and verifying core user flows.

## 🔴 Current Status (As of Dec 23, 2025)
- **AI Service:** ✅ **STABLE** (100% Passing, ESM issues fixed, Logic verified)
- **Products Service:** ✅ **PASSING** (But noisy logs)
- **Auth Store:** ✅ **PASSING**
- **Auth Service:** ❌ **FAILING** (17 failures, brittle mocks, validation mismatches)

## 📋 To-Do List

### Phase 1: Fix the Foundation (Immediate Priority)
- [ ] **Fix `auth.service.test.ts`**
    - [ ] Resolve `TypeError: Cannot read properties of undefined` (Mock call inspection failures).
    - [ ] Fix validation mismatches (e.g., receiving "Invalid email" when expecting "mot de passe" error).
    - [ ] Update mocks to correctly simulate PocketBase responses for all scenarios.
- [ ] **Clean Up Test Output**
    - [ ] Suppress `console.error` during successful error-handling tests to make the "Linus" report clean.

### Phase 2: Backend Beta Verification ("Linus Mode")
- [ ] **Strict Linting & Type Checking**
    - [ ] Run full project type check (tsc).
    - [ ] Audit for any remaining `any` types or `@ts-ignore`.
- [ ] **Integration Scenarios (Backtesting)**
    - [ ] Verify complete flow: `SignUp` -> `Login` -> `Profile Update` in a unified test.
    - [ ] Verify `Search` -> `Filter` -> `Product Details` flow.

### Phase 3: Transition to UI (Nano Banana)
- [ ] **Handover Point:** Once Phase 1 & 2 are complete, the backend is certified "Beta Ready".
- [ ] **UI Integration:** User/Nano Banana takes over for Design/UI implementation.
- [ ] **Expo/iOS Testing:** User performs final visual checks on iOS Simulator.

## 🛠️ Execution Log
- **2025-12-23:** Fixed ESM import errors in `jest.config.js`.
- **2025-12-23:** Refactored `ai.service.ts` to fix false positive category detection ("moderne" != "fashion").
- **2025-12-23:** `ai.service.test.ts` achieved 100% pass rate.
