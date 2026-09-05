# SIMAME SEO Change Log

## 2026-09-05

- Added canonical public route metadata for the homepage, About, Contact, Privacy, Terms, and Account Deletion pages.
- Added WebSite and Organization JSON-LD on the homepage using verified site, logo, email, phone, and Ghana service-market details.
- Rebuilt the XML sitemap to include public trust routes and exclude auth utility pages.
- Expanded robots rules to disallow API, auth, owner dashboard, onboarding, order, business, notification, earnings, staff, and settings surfaces.
- Added staging/preview/develop noindex protection via `X-Robots-Tag: noindex, nofollow` in `next.config.mjs`.
- Added canonical redirect from `www.simame.tech` to `https://simame.tech`.
- Converted duplicate legal routes to permanent redirects: `/privacy-policy` to `/privacy`, `/terms-of-service` to `/terms`, and `/delete-account` to `/account-deletion`.
- Added `/about` and `/contact` as public trust routes.
- Centralized backend URL selection so production hostnames use the production backend and staging/develop/preview use the staging backend.
- Reworked homepage copy to describe Simame, laundry pickup and delivery, wash and fold, dry cleaning, ironing, garment care, and Ghana naturally without unverified ranking or review claims.
## 2026-09-05 - L9.5 Internet Authority Continuation

- Added verified social graph configuration for Instagram, X, and YouTube, while leaving TikTok, Facebook, LinkedIn, and WhatsApp in founder-review state until ownership is confirmed.
- Added stable schema entity IDs for Organization, WebSite, and SoftwareApplication.
- Added public authority routes for `/app`, `/services`, `/how-it-works`, `/for-laundries`, `/locations`, `/campuses`, `/technology`, and `/press`.
- Added a coverage/indexing gate so city, campus, and future provider pages do not enter the sitemap without active provider evidence.
- Added a machine-readable SEO content inventory and search opportunity grouping.
- Strengthened `/about` as the canonical Simame fact hub and `/contact` as a social/contact trust page.
- Expanded the sitemap through the content inventory while keeping staging/develop out.
- Removed or softened unsupported public marketing claims in older marketing components, including free pickup/delivery, verified-provider wording, 24-hour/same-day promises, and guarantee language.
- Added SEO governance tests for sitemap expansion, canonical-domain safety, social sameAs validation, coverage gating, inventory accountability, and unsupported claim regression.
- Added `SIMAME_INTERNET_AUTHORITY_REPORT.md` with the live footprint, social graph, claim audit, competitor baseline, manual founder actions, 30/90/12-month plans, and top 100 search opportunities.
