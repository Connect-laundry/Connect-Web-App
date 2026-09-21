# SIMAME INTERNET DOMINANCE & ENTITY AUTHORITY REPORT

Date: 2026-09-05
Project: Simame - Laundry Connect
Primary domain: https://simame.tech
Staging domain: https://staging.simame.tech
Official brand: Simame
Official handle: @simameapp

## CURRENT INTERNET FOOTPRINT

| Source | URL | Brand name used | Authority | Current / outdated | Links to Simame? | Action |
| --- | --- | --- | --- | --- | --- | --- |
| Official production website | https://simame.tech | Simame | Primary | Current, pre-deploy baseline | Yes | Deploy this branch after staging validation. |
| Staging website | https://staging.simame.tech | Simame | Internal QA | Needs live noindex verification | Unknown from HTTP check | Keep out of index with noindex headers and empty sitemap. |
| Instagram | https://www.instagram.com/simameapp/ | Simame - LaundryConnect | Official-looking social | Current | Needs founder confirmation that bio links to simame.tech | Keep consistent and include in sameAs. |
| X | https://x.com/simameapp | Simame | Official-looking social | Current | Needs founder confirmation that bio links to simame.tech | Keep consistent and include in sameAs. |
| YouTube | https://www.youtube.com/@simameapp | SIMAME - LAUNDRYCONNECT | Official-looking social | Current | Needs founder confirmation that channel links to simame.tech | Keep consistent and include in sameAs. |
| TikTok | https://www.tiktok.com/@simameapp | Unknown from fetched HTML | Reachable but not verified | Needs review | Unknown | Confirm ownership before sameAs or footer link. |
| Facebook | https://www.facebook.com/simameapp/ | Generic Facebook response | Possible but not in known official list | Needs review | Unknown | Confirm ownership before linking. |
| LinkedIn | https://www.linkedin.com/company/simameapp/ | Unknown | Could not verify by direct HTTP | Needs review | Unknown | Check while logged in or claim/create official page. |
| Google Play | Unknown | Unknown | Not verified | Missing | No | Do not invent store URL; add only after live listing. |
| Apple App Store | Unknown | Unknown | Not verified | Missing | No | Do not invent store URL; add only after live listing. |
| Press/media | None found in live search | Unknown | Missing | Missing | No | Build real press/achievement evidence before publishing claims. |
| Connect Laundry footprint | No verified Simame-linked result found in live search | Unknown | Needs founder history | Unknown | Unknown | Do not publish rebrand wording until founder-approved. |
| Entity collision | https://simamigh.com | Simami | Important collision | Separate brand | No | Differentiate Simame with simame.tech, Laundry Connect, Ghanaian marketplace, @simameapp. |

## CODEBASE AUDIT

Framework: Next.js 16 App Router with React 19, TypeScript, Tailwind CSS, shadcn/ui style components, Sentry, Vercel Analytics, Vitest, and Playwright.
Rendering: Public routes are static/server-rendered App Router pages. Authenticated owner pages are client-heavy behind protected layouts.
Routes: Public homepage, legal pages, About, Contact, App, Services, How It Works, For Laundries, Locations, Campuses, Technology, and Press. Private owner routes remain dashboard, orders, business, notifications, earnings, staff, settings, onboarding, and auth.
APIs: Next route handlers proxy authentication and backend calls to the configured Simame backend. Geocoding and auth routes remain private/API surfaces.
Environment handling: Production domain maps to production backend; staging, preview, and develop map to staging backend. Staging/develop/preview indexing is disabled.
Vercel configuration: next.config.mjs controls headers, CSP, redirects, and noindex headers. vercel.json exists but was not changed in this pass.
Images/icons/fonts: Brand images exist in public/images; PWA icons exist in public. Search-critical pages use Next Image where new media was added.
Metadata: Centralized in src/shared/lib/seo.ts with production canonical URLs.
JSON-LD: Homepage has WebSite and Organization. App page has SoftwareApplication without invented store/rating fields.
Mobile app links: App page exists, but store URLs are deliberately absent until verified.
Footer/header: Footer now includes crawlable public route links and verified social links. Navbar links to authority pages.
Legal: Privacy, Terms, and Account Deletion are public and in sitemap.
Blog/content system: None exists yet.
Provider/location data: Owner/provider data exists inside authenticated APIs and types, but no public provider marketplace pages exist yet.
Search/filter implementation: Owner dashboard filters exist. Public marketplace search is not exposed in this web app.

## BRAND ENTITY

Primary: Simame
Descriptor: Laundry Connect
Entity statement: Simame is a Ghanaian digital laundry marketplace and laundry connect platform.
Legacy brand relationship: Connect Laundry may be historical, but it is not founder-verified in this codebase or live search pass. Do not publish rebrand claims yet.
Entity IDs: Organization https://simame.tech/#organization, WebSite https://simame.tech/#website, SoftwareApplication https://simame.tech/app#software.

## SOCIAL GRAPH

Instagram: VERIFIED - https://www.instagram.com/simameapp/ - title returned Simame - LaundryConnect (@simameapp).
TikTok: NEEDS FOUNDER ACTION - https://www.tiktok.com/@simameapp returned 200 but no Simame-identifying fetched text.
X: VERIFIED - https://x.com/simameapp - title returned Simame (@simameapp).
YouTube: VERIFIED - https://www.youtube.com/@simameapp - title returned SIMAME - LAUNDRYCONNECT.
LinkedIn: NEEDS FOUNDER ACTION - candidate URL could not be verified by direct HTTP.
Facebook: NEEDS FOUNDER ACTION - candidate URL returned generic Facebook title.
WhatsApp: NEEDS FOUNDER ACTION - official business WhatsApp link not verified; do not expose a private founder number by guessing.

## BRAND SEARCH

Simame: Weak public footprint. Search found an entity collision with Simami at simamigh.com and no strong indexed Simame result beyond the official site baseline.
Simame Laundry: Needs deployment of service/app/about pages and social profile consistency.
Simame Ghana: Needs stronger official website entity graph, socials, app listings, and external citations.
Connect Laundry: No verified Simame-linked footprint found. Treat as a history/reclamation project, not an SEO keyword stuffing opportunity.
Laundry Connect: Generic and internationally ambiguous. Simame must lead with its distinct brand and Ghana context.

## NATIONAL SEO

Ghana: Homepage and new services/app/technology pages support national entity positioning without claiming nationwide service.
Accra: High business value, but no public active-provider source exists in this web app. Accra city page remains gated.
Kumasi: High relevance and potential campus tie-in, but requires verified active providers and founder-approved KNUST history before an indexable city/campus page.

## CAMPUS SEO

KNUST: Strong opportunity, but do not imply official KNUST affiliation. Needs active nearby providers, real availability, and approved origin story.
Other active campuses: None verified.
Planned/non-active: University of Ghana, UPSA, ATU, UCC, KTU, UEW, and others should remain non-indexable until operationally ready.

## SERVICE SEO

Laundry: /services and homepage support general laundry intent.
Pickup: /how-it-works and /services explain pickup as location-dependent.
Delivery: Delivery wording is conditional and service-area aware.
Dry Cleaning: Present as partner-supported, not universally guaranteed.
Wash & Fold: Present as a core service category, subject to partner support.

## APP DISCOVERY

Website: /app added.
App Store: No verified URL. Do not publish a badge yet.
Play Store: No verified URL. Do not publish a badge yet.
Deep links: No apple-app-site-association or assetlinks.json audited as live architecture in this pass.
SoftwareApplication schema: Added on /app with no fake ratings, offers, or download URLs.

## INNOVATION DISCOVERY

Startup/technology content: /technology added to explain the marketplace model, mobile ordering, pricing operations, tracking, notifications, and location-aware expansion.
Press: /press added as a media kit shell without fake press.
External authority: Still missing. Needs real startup, university, partner, and press references.
Achievements: None published. CodeFest/competition claims need external proof before use.

## CLAIM AUDIT

| Claim | Visible location | Source of evidence | Status | Action |
| --- | --- | --- | --- | --- |
| Ghana's first laundry app | Not present in current public code | No independent evidence found | NOT PROVEN | DO NOT USE. |
| Nationwide service / all Ghana | Not present in current public code | No active provider source | NOT PROVEN | Use Ghanaian marketplace/brand language, not service availability. |
| 1,000+ users or customers | Removed/not present in active public code | No evidence | UNVERIFIED | Do not use without analytics proof. |
| 4.9/5 or ratings | Removed/not present in active public code | No review source | UNVERIFIED | Do not use structured ratings or visible ratings. |
| Verified providers | Softened to service information/partner details | No verification source exposed publicly | UNVERIFIED | Reintroduce only after provider verification policy is visible and enforced. |
| Free pickup/delivery | Removed from older marketing components | No pricing evidence | UNVERIFIED | Do not use unless operations approves. |
| 24-hour/same-day | Softened to provider-dependent express/turnaround | No coverage/service evidence | UNVERIFIED | Use only per provider/city where true. |
## MARKETPLACE SEO

Provider pages: Not implemented publicly. Future route should be /laundries/{provider-slug} with noindex unless active, approved, unique, and useful.
City pages: Not implemented publicly. Future routes like /locations/accra and /locations/kumasi require active providers and unique local inventory.
Campus pages: Not implemented publicly. Future routes like /campuses/knust require real coverage and no false affiliation.
Index quality gate: Added in src/shared/lib/coverage.ts and tested.

## CONTENT AUTHORITY

Existing topics: Brand, services, how it works, app, locations policy, campus strategy, technology, press, contact, legal.
New topics: Original data reports, laundry pricing guide, garment care guides, provider business resources, student laundry guides.
Original data opportunities: Laundry Price Index Ghana, Average Laundry Turnaround in Kumasi, Student Laundry Habits, Provider Digitization Report, Most Requested Laundry Services.

## COMPETITOR LANDSCAPE

| Competitor | Evidence | Strengths | Weaknesses | Simame differentiation |
| --- | --- | --- | --- | --- |
| LaundryBus | https://laundrybus.app | Pickup/delivery positioning, partner language, SMS updates | Search result showed no configured coverage nearby | Simame can be clearer on provider eligibility, locations, and marketplace pages. |
| Smile Laundry | https://smilelaundrygh.com/laundry/ | Strong Accra service page, app/phone ordering, real address/phones | Single-provider model | Simame can differentiate with provider discovery, comparison, booking, and partner tools. |
| Wash N Go | https://washngolaundryservices.com/aboutwashngolaundryghana/ | Real Accra/Kumasi locations and long operating history claims | Copy has broad claims and duplicated content | Simame can be cleaner, more structured, and marketplace-led. |
| Washam | https://washamapp.com | Strong modern positioning, WhatsApp assistant, visible pricing examples | May lean heavily on WhatsApp experience | Simame can emphasize app marketplace, owner dashboard, and provider operations. |
| Cleanzo | https://www.cleanzolaundry.org | Detailed local Accra areas and transparent prices | Local single-provider scope | Simame can scale through provider inventory while preserving quality thresholds. |
| SAHA | https://saha.africa/services/laundry | Clear service/pricing layout for Accra | Broad services platform, not laundry-specific | Simame can own laundry-specific marketplace depth. |
| myLaundry | https://mylaundrynow.com | App, WhatsApp, Accra coverage, reviews | Uses strong leading claims that need proof | Simame should compete with clearer evidence and no inflated claims. |
| Sparklean | https://www.sparklean-laundry.com | Aggressive Accra commercial page | Heavy unsupported claims in search result | Simame should avoid fake authority and win with trust architecture. |

## AI SEARCH

Google AI: Needs crawlable, fact-first public pages and external citations. No special AI-only hack exists.
Bing/Copilot: Needs sitemap submission, consistent social/entity data, and external mentions.
Entity clarity: Improved locally through About, Press, Organization, WebSite, and verified sameAs.
Citation readiness: Improved through direct question-style content on About, App, How It Works, Locations, and Press.

## STRUCTURED DATA

Organization: Present on homepage with stable @id and verified sameAs only.
WebSite: Present on homepage with stable @id.
SoftwareApplication: Present on /app; no fake ratings/download URLs.
Breadcrumb: Not implemented yet.
Article: Not implemented because no blog/news system exists.
Other: Provider, ItemList, LocalBusiness, Review, and AggregateRating schemas are intentionally not used yet.

## TECHNICAL

Robots: Allows public pages and disallows private/API/auth/dashboard surfaces.
Sitemap: Expanded to authority pages and excludes staging/develop.
Canonical: Production canonical URLs fixed to https://simame.tech.
Rendering: Public pages are server-rendered App Router routes.
404: Production currently returns 404 for /about and /contact until this branch deploys.
Redirects: www.simame.tech to apex; legacy legal routes redirect to canonical legal pages.
Staging noindex: Implemented in config and tested locally; live staging needs post-deploy header verification.

## PERFORMANCE

LCP: Not measured with Lighthouse in this pass.
INP: Not measured with Lighthouse in this pass.
CLS: New pages use stable layout and explicit image sizing where image content was added.
Lighthouse: Not run against production because this branch is local and not deployed.
Performance budget recommendation: Keep public route JS under control, avoid heavy maps on SEO pages, defer social embeds, and use optimized images for app screenshots/media.

## AUTHORITY

Backlinks: Not verified beyond live search. Needs Search Console/Bing once domain ownership is confirmed.
Mentions: Live search did not surface strong Simame mentions.
Press: Missing.
University: Missing or unverified.
Partners: Missing public provider/profile architecture.

## SEARCH CONVERSION

Organic funnel: Search impression -> public page -> service/app/provider CTA -> registration/app-store click/booking intent -> completed order where attribution permits.
Tracking: Vercel Analytics dependency exists; GA4/Search Console/Bing processes still need founder setup.
App install tracking: Not implemented because store URLs are not verified.

## FILES CHANGED

- src/shared/lib/social.ts: official social graph with verified vs review states.
- src/shared/lib/coverage.ts: coverage and indexing eligibility policy.
- src/shared/lib/seo-content.ts: machine-readable SEO content inventory and opportunity groups.
- src/shared/lib/seo.ts: expanded public sitemap routes and canonical entity IDs.
- src/shared/components/PublicPageShell.tsx: shared public page shell.
- src/app/page.tsx: stable WebSite/Organization schema and verified sameAs.
- src/app/app/page.tsx: app discovery page and SoftwareApplication schema.
- src/app/services/page.tsx: service taxonomy page.
- src/app/how-it-works/page.tsx: marketplace workflow page.
- src/app/for-laundries/page.tsx: laundry partner page.
- src/app/locations/page.tsx: national location hub with city eligibility safeguards.
- src/app/campuses/page.tsx: campus strategy hub.
- src/app/technology/page.tsx: innovation and marketplace technology page.
- src/app/press/page.tsx: press/media kit and verified social graph page.
- src/app/about/page.tsx: strengthened company fact hub.
- src/app/contact/page.tsx: added verified social links.
- src/app/manifest.ts: fixed brand encoding in manifest name.
- src/features/landing/data/landingData.ts: navigation expanded to authority pages.
- src/features/landing/components/Footer.tsx: footer route/social graph expansion.
- src/features/marketing/data/landingContent.ts: unsupported claims softened.
- src/features/marketing/components/MarketingHero.tsx: unsupported operational claims softened.
- src/features/marketing/components/MarketingFooter.tsx: unsupported free delivery language removed.
- src/features/marketing/components/TrustPills.tsx: unsupported verified/free claims removed.
- src/features/marketing/components/HeroPhoto.tsx: unsupported free pickup phrase removed.
- src/app/seo.test.ts: expanded SEO governance tests.
- SEO_CHANGELOG.md: updated with L9.5 continuation summary.
- SIMAME_INTERNET_AUTHORITY_REPORT.md: this report.

## NEW ROUTES

/app, /services, /how-it-works, /for-laundries, /locations, /campuses, /technology, /press

## REDIRECTS

- https://www.simame.tech/:path* -> https://simame.tech/:path*
- /privacy-policy -> /privacy
- /terms-of-service -> /terms
- /delete-account -> /account-deletion

## AUTOMATED TESTS

Final verification: npm.cmd run build passed; npx.cmd tsc --noEmit passed; npm.cmd run lint passed with 0 errors and 116 existing warnings; npx.cmd vitest run --pool=forks --maxWorkers=1 --no-file-parallelism passed with 8 test files and 33 tests; focused SEO test passed with 12 tests.

## LIVE TESTS

Production HTTP baseline before this branch deploys:
- https://simame.tech returned 200.
- https://simame.tech/robots.txt returned 200.
- https://simame.tech/sitemap.xml returned 200.
- https://simame.tech/about returned 404.
- https://simame.tech/contact returned 404.
- https://staging.simame.tech direct check could not complete cleanly in PowerShell.

Social direct URL checks:
- Instagram @simameapp returned HTTP 200 and Simame-identifying title.
- X @simameapp returned HTTP 200 and Simame-identifying title.
- YouTube @simameapp returned HTTP 200 and Simame-identifying title.
- TikTok @simameapp returned HTTP 200 but no Simame-identifying fetched text.
- Facebook @simameapp returned HTTP 200 but generic title.
- LinkedIn candidate could not be verified by direct HTTP.

## MANUAL FOUNDER TASKS

1. Confirm ownership and profile settings for Instagram, X, YouTube, TikTok, WhatsApp, Facebook, and LinkedIn.
2. Make every official social bio use Simame, @simameapp, a consistent Laundry Connect descriptor, and https://simame.tech.
3. Verify whether Connect Laundry truly became Simame before publishing migration wording.
4. Verify App Store and Google Play URLs, then add official badges to /app.
5. Verify Search Console and submit sitemap after deployment.
6. Verify Bing Webmaster Tools and decide whether to configure IndexNow.
7. Confirm whether Simame is eligible for a Google Business Profile under Google's rules.
8. Gather proof for awards, competitions, CodeFest mentions, university coverage, or press.
9. Approve founder/team public bios before publishing team content.
10. Confirm active provider coverage for Accra, Kumasi, and KNUST before city/campus pages are created.

## 30-DAY PLAN

Week 1: Deploy technical foundation to develop, confirm staging noindex, crawl all new routes, fix broken links, then deploy to production after approval.
Week 2: Confirm social ownership, align bios, add verified TikTok/LinkedIn/Facebook/WhatsApp only after proof, and connect app-store URLs if live.
Week 3: Validate real service coverage, write one excellent service/how-it-works expansion, and prepare Accra/Kumasi/KNUST page drafts only if provider data supports them.
Week 4: Start authority outreach to laundry partners, campus organizations, startup communities, and legitimate Ghana tech/media sources. Measure branded search and indexed pages.

## 90-DAY PLAN

- Build provider-page quality gate backed by active provider data.
- Launch first city page only where booking is real and inventory is meaningful.
- Launch campus page only where coverage and no-affiliation wording are approved.
- Publish one strong startup/product story.
- Build a small support/FAQ knowledge base.
- Add Search Console query groups for brand, legacy, app, service, local, campus, innovation, and support.
- Track organic conversion to registration/app clicks without sending PII.
- Earn legitimate partner/university/press mentions.

## 12-MONTH PLAN

- Expand SEO only where marketplace coverage expands.
- Build public provider profiles with moderation and noindex fallbacks.
- Publish original aggregated data only after privacy thresholds are met.
- Create an annual State of Laundry and Garment Care in Ghana report when marketplace data is sufficient.
- Grow YouTube/TikTok/Instagram search presence with real tutorials, provider stories, campus activations, and product demos.
- Develop startup/technology authority through real milestones, case studies, press, and university references.
- Maintain monthly SERP ownership, category authority, AI discovery, backlink, and conversion reporting.
## TOP 100 SEARCH OPPORTUNITIES

Format: query - business value / achievability / authority required - target - status.

### Brand
1. Simame - High / Medium / Medium - / - needs indexing.
2. Simame app - High / Medium / Medium - /app - page added, stores missing.
3. Simame laundry - High / Medium / Medium - /services - page added.
4. Simame Ghana - High / Medium / Medium - /about - page added.
5. Simame Laundry Connect - High / Medium / Medium - /about - page added.
6. simame.tech - Medium / High / Low - / - production live.
7. @simameapp - Medium / Medium / Medium - /press - socials added.
8. Simame contact - Medium / High / Low - /contact - page added.
9. Simame support - Medium / Medium / Low - /contact - support hub later.
10. Simame account deletion - Medium / High / Low - /account-deletion - existing.

### Legacy
11. Connect Laundry Ghana - Medium / Low / Medium - future history section - needs founder proof.
12. Connect Laundry app - Medium / Low / Medium - future history section - needs founder proof.
13. Connect Laundry KNUST - Medium / Low / High - future KNUST page - needs proof and coverage.
14. Laundry Connect Ghana - Medium / Medium / Medium - /about - page added.
15. connect laundry Simame - Medium / Low / Medium - future press/history - needs proof.

### Service
16. laundry services Ghana - High / Medium / Medium - /services - page added.
17. laundry pickup Ghana - High / Medium / Medium - /how-it-works - page added.
18. laundry delivery Ghana - High / Medium / Medium - /services - page added.
19. dry cleaning Ghana - High / Medium / Medium - /services - page added.
20. wash and fold Ghana - High / Medium / Medium - /services - page added.
21. ironing service Ghana - Medium / Medium / Medium - /services - page added.
22. garment care Ghana - Medium / Medium / Medium - /services - page added.
23. laundry pickup and delivery Ghana - High / Medium / Medium - /how-it-works - page added.
24. online laundry service Ghana - High / Medium / Medium - /app - page added.
25. laundry marketplace Ghana - High / Medium / High - /technology - page added.

### Local
26. laundry Ghana - High / Low / High - /locations - hub added.
27. laundry Accra - High / Low / High - future /locations/accra - gated.
28. laundry service Accra - High / Low / High - future /locations/accra - gated.
29. laundry pickup Accra - High / Low / High - future /locations/accra - gated.
30. laundry delivery Accra - High / Low / High - future /locations/accra - gated.
31. dry cleaning Accra - High / Low / High - future /locations/accra - gated.
32. wash and fold Accra - High / Low / High - future /locations/accra - gated.
33. laundry Kumasi - High / Low / High - future /locations/kumasi - gated.
34. laundry delivery Kumasi - High / Low / High - future /locations/kumasi - gated.
35. dry cleaning Kumasi - Medium / Low / High - future /locations/kumasi - gated.
36. laundry near me Ghana - High / Low / Very high - future marketplace search - not built.
37. laundries near me - High / Low / Very high - future marketplace search - not built.
38. laundry pickup near me - High / Low / Very high - future marketplace search - not built.
39. laundry delivery near me - High / Low / Very high - future marketplace search - not built.
40. dry cleaners near me Ghana - Medium / Low / High - future provider/location pages - not built.

### Campus
41. campus laundry Ghana - High / Medium / Medium - /campuses - page added.
42. student laundry Ghana - High / Medium / Medium - /campuses - page added.
43. laundry app for students Ghana - High / Medium / Medium - /campuses - page added.
44. laundry KNUST - High / Low / High - future /campuses/knust - gated.
45. student laundry KNUST - High / Low / High - future /campuses/knust - gated.
46. laundry around KNUST - High / Low / High - future /campuses/knust - gated.
47. University of Ghana laundry - Medium / Low / High - future campus page - not active.
48. UPSA laundry service - Medium / Low / High - future campus page - not active.
49. UCC laundry service - Medium / Low / High - future campus page - not active.
50. KTU laundry service - Medium / Low / High - future campus page - not active.

### App
51. laundry app Ghana - High / Medium / High - /app - page added.
52. laundry booking app Ghana - High / Medium / High - /app - page added.
53. laundry pickup app - High / Medium / High - /app - page added.
54. laundry delivery app Ghana - High / Medium / High - /app - page added.
55. dry cleaning app Ghana - Medium / Medium / High - /app - page added.
56. laundry app for Android Ghana - Medium / Low / Medium - /app - needs Play Store URL.
57. laundry app for iPhone Ghana - Medium / Low / Medium - /app - needs App Store URL.
58. Simame Android app - High / Low / Medium - /app - needs store URL.
59. Simame iPhone app - High / Low / Medium - /app - needs store URL.
60. app to book laundry in Ghana - High / Medium / High - /app - page added.

### Business
61. laundry business Ghana - High / Medium / Medium - /for-laundries - page added.
62. laundry owner dashboard - High / Medium / Medium - /for-laundries - page added.
63. laundry management Ghana - Medium / Medium / High - /for-laundries - page added.
64. laundry marketplace for providers - High / Medium / Medium - /for-laundries - page added.
65. grow laundry business Ghana - High / Medium / Medium - future guide - not built.
66. digital ordering for laundries - Medium / Medium / Medium - /technology - page added.
67. laundry delivery zones - Medium / Medium / Medium - future provider guide - not built.
68. laundry pricing management - Medium / Medium / Medium - /for-laundries - page added.
69. laundry staff management app - Medium / Medium / Medium - /for-laundries - page added.
70. laundry order tracking software Ghana - Medium / Medium / High - /technology - page added.

### Innovation
71. innovative apps Ghana - Medium / Low / Very high - /technology plus press - authority missing.
72. Ghanaian startup apps - Medium / Low / Very high - /technology plus press - authority missing.
73. Ghana tech startups - Medium / Low / Very high - future press/story - authority missing.
74. digital marketplace Ghana - Medium / Medium / High - /technology - page added.
75. campus startup Ghana - Medium / Low / High - future story - needs founder proof.
76. laundry technology Ghana - Medium / Medium / Medium - /technology - page added.
77. service marketplace Ghana - Medium / Medium / High - /technology - page added.
78. local business digitization Ghana - Medium / Medium / High - /technology - page added.
79. startup solving laundry Ghana - Medium / Low / High - future story - not built.
80. mobile marketplace Ghana startup - Medium / Low / High - /technology - page added.

### Informational
81. how does laundry pickup work - Medium / High / Medium - /how-it-works - page added.
82. how does laundry delivery work - Medium / High / Medium - /how-it-works - page added.
83. how much does laundry cost in Ghana - High / Low / High - future pricing guide - needs data.
84. dry cleaning vs laundry - Medium / High / Medium - future guide - not built.
85. what is wash and fold - Medium / High / Medium - /services - page added.
86. how to choose a laundry service - Medium / High / Medium - future guide - not built.
87. student laundry tips Ghana - Medium / Medium / Medium - /campuses plus guide - page added.
88. laundry pickup preparation - Medium / High / Low - future guide - not built.
89. how to dry clean suits in Ghana - Medium / Low / Medium - future guide - needs expert source.
90. ironing service near me - Medium / Low / High - future provider/location pages - not built.

### Trust
91. Simame privacy policy - Medium / High / Low - /privacy - existing.
92. Simame terms of service - Medium / High / Low - /terms - existing.
93. delete Simame account - Medium / High / Low - /account-deletion - existing.
94. Simame refund - Medium / Low / Medium - future support policy - not built.
95. Simame payment problem - Medium / Low / Medium - future support policy - not built.
96. is Simame legit - High / Medium / High - /about plus external proof - needs authority.
97. Simame reviews - High / Low / High - app stores/reviews future - missing.
98. Simame WhatsApp - Medium / Low / Low - /contact future - needs official link.
99. Simame press - Medium / Medium / Medium - /press - page added.
100. Simame logo - Low / High / Low - /press - page added.

## CRITICAL RISKS

- Entity collision with Simami can confuse branded search unless Simame reinforces simame.tech, @simameapp, and Laundry Connect consistently.
- App-store discovery cannot mature until official store listings exist and cross-link to the website.
- TikTok/WhatsApp/LinkedIn/Facebook should not be added to sameAs until ownership is confirmed.
- Accra, Kumasi, KNUST, and provider pages must stay gated until active provider data exists.
- Unsupported claims such as first, best, number one, nationwide, fake ratings, fake reviews, and fake user counts would damage trust.
- A marketplace can become an SEO spam surface if provider profiles are public without moderation.
- Production currently lacks the new local routes until deployment, so live crawl still shows 404 for /about and /contact.

## FINAL VERDICT

🟡 TECHNICAL/ENTITY FOUNDATION READY — EXTERNAL AUTHORITY STILL BUILDING

## SOURCES

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google canonical documentation: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Business Profile guidelines: https://support.google.com/business/answer/3038177
- Google service-area guidelines: https://support.google.com/business/answer/9157481
- Next.js metadata docs: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js robots docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- Next.js sitemap docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Vercel environment docs: https://vercel.com/docs/environment-variables
- IndexNow documentation: https://www.indexnow.org/documentation
- LaundryBus: https://laundrybus.app
- Smile Laundry: https://smilelaundrygh.com/laundry/
- Wash N Go: https://washngolaundryservices.com/aboutwashngolaundryghana/
- Washam: https://washamapp.com
- Cleanzo Laundry: https://www.cleanzolaundry.org
- SAHA Laundry: https://saha.africa/services/laundry
- myLaundry: https://mylaundrynow.com
- Sparklean: https://www.sparklean-laundry.com
- Simami collision: https://simamigh.com