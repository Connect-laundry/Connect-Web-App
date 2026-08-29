# CONNECT Web Git Branching Strategy & Release Pipeline Guide

This document defines the branching strategy, environment pipeline, hotfix protocol, and GitHub protection rules for `connect_web`.

---

## 🏗️ 1. Environment & Branch Overview

| Environment | Git Branch | Domain URL | Trigger / Deployment | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Production** | `main` | `https://simame.me` | Push / PR Merge to `main` | Production live application used by customers. |
| **Staging** | `develop` | `https://staging.simame.me` | Push / PR Merge to `develop` | Integration and QA testing environment. |
| **Feature / Fix** | `feature/*`, `fix/*` | Ephemeral Preview | PR targeting `develop` | Active development of new features or non-critical bugs. |
| **Emergency Hotfix** | `hotfix/*` | `https://simame.me` (post-merge) | PR targeting `main` (then back-merged to `develop`) | Critical production bugs requiring immediate deployment. |

---

## 🔄 2. Standard Development Workflow

```
   Local Feature Branch               Staging Server                    Production Server
 ┌──────────────────────┐          ┌──────────────────┐               ┌──────────────────┐
 │ feature/new-order-ui │          │  develop branch  │               │   main branch    │
 └──────────┬───────────┘          └────────┬─────────┘               └────────┬─────────┘
            │                               │                                  │
            │ 1. PR to develop              │                                  │
            ├──────────────────────────────►│                                  │
            │    (CI Validation Runs)       │                                  │
            │                               │ 2. Auto-Deploy to Staging        │
            │                               ├─────────────────────────────────►│ (QA Testing)
            │                               │                                  │
            │                               │ 3. PR develop -> main            │
            │                               ├─────────────────────────────────►│
            │                                                                  │ 4. Auto-Deploy to Prod
            │                                                                  ▼
```

### Step-by-Step Feature Lifecycle:
1. **Branch out from `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/order-filter-update
   ```

2. **Develop & Commit**:
   - Write your code and ensure local checks pass (`npm run lint`, `npx tsc --noEmit`, `npm test`).

3. **Create Pull Request to `develop`**:
   - Push your branch: `git push origin feature/order-filter-update`
   - Open a Pull Request targeting `develop`.
   - GitHub Actions runs full CI validation (Lint, Types, Unit Tests, Build).

4. **Merge & Staging Deployment**:
   - Once approved and CI passes, merge into `develop`.
   - The Staging server automatically deploys from `develop`.
   - Perform QA testing on the Staging environment.

5. **Release to Production**:
   - Create a Release PR from `develop` targeting `main`.
   - Upon approval and CI verification, merge into `main`.
   - The Production server automatically deploys from `main`.

---

## 🚨 3. Emergency Hotfix Workflow (Customer Bugs in Production)

If a critical bug is reported in **Production** that must be fixed immediately without waiting for standard staging release cycles:

```
                  ┌──────────────────────────────┐
                  │    Production (main branch)  │
                  └──────────────┬───────────────┘
                                 │
                                 │ 1. Branch off main
                                 ▼
                  ┌──────────────────────────────┐
                  │   hotfix/critical-login-fix  │
                  └──────────────┬───────────────┘
                                 │
                                 │ 2. Emergency PR to main
                                 ▼
                  ┌──────────────────────────────┐
                  │    Production (main branch)  │ 🚀 Auto-deploys to Prod
                  └──────────────┬───────────────┘
                                 │
                                 │ 3. Back-merge to develop
                                 ▼
                  ┌──────────────────────────────┐
                  │     Staging (develop)        │ 🔄 Staging updated
                  └──────────────────────────────┘
```

### Step-by-Step Hotfix Lifecycle:

1. **Branch off `main`**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-login-fix
   ```

2. **Implement Fix & Validate Locally**:
   - Fix the urgent issue.
   - Verify locally with `npm run build` and `npm test`.

3. **Open Emergency PR targeting `main`**:
   - Push your branch: `git push origin hotfix/critical-login-fix`
   - Create a Pull Request with target branch set to `main`.
   - Mark the PR as **HOTFIX** in the template.

4. **Merge & Instant Production Deploy**:
   - Review and merge into `main`.
   - CI runs accelerated validation and triggers instant deployment to Production.

5. **Back-Merge into `develop` (CRITICAL)**:
   - To ensure Staging does not lose the fix:
   ```bash
   git checkout develop
   git pull origin develop
   git merge hotfix/critical-login-fix
   git push origin develop
   ```
   - *Alternatively, open a PR from `hotfix/critical-login-fix` (or `main`) into `develop` on GitHub.*

---

## 🔒 4. How to Configure GitHub Branch Protection Rules

To enforce that **no developer can push directly to `main` or `develop`**, configure these rules in GitHub:

1. Go to your GitHub Repository: `Settings` ➔ `Branches` (or `Rules` ➔ `Rulesets`).
2. Click **Add branch protection rule** (or **Create ruleset**).

### A. Protection Rule for `main` (Production):
- **Branch pattern**: `main`
- ✅ **Require a pull request before merging**:
  - Require approvals: `1` (or more)
  - Dismiss stale pull request approvals when new commits are pushed
- ✅ **Require status checks to pass before merging**:
  - Search and add: `Validate Codebase`, `Security Audit`
- ✅ **Require branches to be up to date before merging**
- ✅ **Block direct pushes** (Do not allow bypass unless Admin emergency override)
- ✅ **Restrict pushes that create matching branches**

### B. Protection Rule for `develop` (Staging):
- **Branch pattern**: `develop`
- ✅ **Require a pull request before merging**:
  - Require approvals: `1`
- ✅ **Require status checks to pass before merging**:
  - Search and add: `Validate Codebase`
- ✅ **Block direct pushes**

---

## 🧪 5. Local Verification Commands

Before creating any PR, developers should run:

```bash
# 1. Lint check
npm run lint

# 2. TypeScript type check
npx tsc --noEmit

# 3. Unit tests
npm test

# 4. Production build test
npm run build
```
