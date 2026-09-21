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

## 2026-09-05 - L9.6 Brand Disambiguation & AI Search Authority

- Added `Organization.alternateName` array: `['Simame Laundry Connect', 'Connect Laundry', 'Laundry Connect Ghana']` — connects historical brand names to the Simame entity in structured data.
- Added `WebSite.alternateName` array with the same values for WebSite consistency.
- Added server-rendered entity answer block on homepage: a visually-hidden `<section>` with "What is Simame?" and the canonical description — crawlable by Google AI Overview and AI Mode without being visible clutter.
- Added `FAQPage` JSON-LD schema on homepage with canonical entity description including S-I-M-A-M-E spelling, simame.tech URL, @simameapp handle, and Connect Laundry history.
- Rebuilt `/about` as a comprehensive AI-citation-ready fact hub with eight visible Q&A accordion items (`<details>`/`<summary>`), full FAQPage JSON-LD schema, brand spelling card in factRows, and BreadcrumbList schema.
- Rebuilt `/press` with a prominent brand identity card showing S-I-M-A-M-E spelling, three canonical entity descriptions (short / medium / press boilerplate ~100 words), and a note to journalists not to use alternate spellings. `ENTITY_DESCRIPTIONS` constant centralises the approved copy.
- Rebuilt `/app` with a named entity identity block ('Simame – Laundry Connect'), search guidance text ('Search "Simame" on Google Play & App Store'), `FAQPage` schema for download-intent queries, and a visible FAQ accordion. Store URL slots commented for when listings are confirmed.
- Added `SoftwareApplication.alternateName: 'Simame – Laundry Connect'` on the app page.
- Added six new SEO regression tests: Simami isolation test (never appears in schema/metadata/sameAs), entity answer block presence, About FAQPage assertions, App FAQPage assertions, press spelling card assertions.
- Verified all routes return HTTP 200 in production with no blocking x-robots-tag.
- Live search audit confirmed 0 Google-indexed pages as of 2026-09-05 (pre-indexing state). Highest-impact next action: founder must log into Google Search Console and request URL inspection + indexing for all 14 pages.
