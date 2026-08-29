## 📌 Pull Request Description

### PR Type
Please check the option that applies:
- [ ] 🚀 **Feature / Enhancement** (`feature/*` ➔ `develop`)
- [ ] 🐛 **Bug Fix** (`fix/*` ➔ `develop`)
- [ ] 🚨 **HOTFIX** (Emergency Prod Fix: `hotfix/*` ➔ `main`)
- [ ] 📦 **Release Promotion** (`develop` ➔ `main` for Production Release)
- [ ] 🔧 **Chore / Refactor / Infrastructure**

---

## 🎯 Target Branch
- Target Branch: `develop` *(Staging Testing)* **OR** `main` *(Production / Hotfix)*

---

## 📝 Summary of Changes
Provide a brief summary of what this PR introduces or fixes:
- 

---

## 🧪 Testing & Verification
Check off all items completed before requesting review:
- [ ] Local build (`npm run build`) passed without errors.
- [ ] TypeScript check (`npx tsc --noEmit`) passed.
- [ ] Linting (`npm run lint`) passed with 0 errors.
- [ ] Unit tests (`npm test`) passed.
- [ ] Tested on Staging environment (if targeting `main`).

---

## 🚨 Hotfix Notice (For Customer Bugs in Production)
If this is an emergency **Hotfix PR** targeting `main`:
1. [ ] Hotfix branch was created from `main`.
2. [ ] PR targets `main` for immediate production deployment.
3. [ ] After merging to `main`, remember to **back-merge** into `develop`!
