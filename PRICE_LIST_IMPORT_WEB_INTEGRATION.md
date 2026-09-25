# Price-list import: web integration

How the owner web app lets a laundry owner photograph or upload an existing
price list, review what Simame read, and put it into their prices. The backend
contract lives in `connect_new_backend/docs/PRICE_LIST_IMPORT_API.md`; this
document covers the web side only.

## What the owner sees

1. On the pricing screen: **Already have a price list?** with **Take a photo**
   (`capture="environment"`, opens the rear camera where supported) and
   **Upload price list** (plain file picker, works everywhere).
2. A preview with **Read price list · Retake · Choose another · Remove** and
   four framing tips.
3. "Reading your price list…", then "Finding services and prices…", then
   "Almost there…" after 30 s. **Cancel** is always available.
4. A review list: each row has a **Looks good / Please check / Could not read**
   badge in words (not only colour), plain-language notes, and the line it was
   read from ("Read from photo: …"). No provider, model or confidence numbers.
5. **Apply prices** (onboarding) or **Confirm & import** (dashboard).

Manual entry is always on screen. If scanning is switched off or unavailable,
the panel renders nothing; if a scan fails, the message tells the owner they
can keep entering prices manually.

## Where it lives

| Place | Component | What "apply" does |
| --- | --- | --- |
| Onboarding → Price List step (BY_ITEM, HYBRID) | `onboarding/components/steps/OnboardingPriceScan.tsx` | Fills the wizard's own state (items per service tab; per-kg as a 1 kg weight tier). Nothing is saved until **Complete Registration**. |
| Onboarding → Pricing step (BY_WEIGHT) | same | Fills the weight tiers. |
| Business → Services & Pricing | `business/components/DashboardPriceScan.tsx` | Calls the server confirm (validated, atomic, idempotent), then reloads the price editors. |

Shared module: `src/features/price-import/`
(`api.ts`, `types.ts`, `hooks/usePriceListScan.ts`, `components/`, `lib/review.ts`
for mapping, `lib/image.ts` for upload preparation, `lib/messages.ts` for all
owner-facing wording). Both wrappers load the panel with `next/dynamic`, so the
pricing form renders without it.

## Endpoints used

All requests go browser → `/api/proxy/…` (the Next.js BFF, which adds the session
token) → Django. The browser never calls Google or OCR.space, and no provider key
exists in the web app (verified by scanning the production bundle).

| Call | Purpose |
| --- | --- |
| `GET /laundries/dashboard/price-imports/availability/` | Show or hide the panel. |
| `POST /laundries/dashboard/price-imports/?async=1` (multipart `source_image`) | Start a scan. Returns **202** with a `PROCESSING` job. |
| `GET /laundries/dashboard/price-imports/{id}/` | Poll every 2 s until `READY` or `FAILED` (client gives up after 100 s). |
| `POST /laundries/dashboard/price-imports/{id}/confirm/` | Dashboard only: save the owner's rows. |
| `POST /laundries/dashboard/price-imports/{id}/cancel/` | Discard an unused `READY` scan (Discard, or after onboarding apply). |

Statuses: `PENDING`, `PROCESSING`, `READY` (always means *review required*),
`CONFIRMED`, `FAILED`, `CANCELLED`. Types in `price-import/types.ts` mirror the
backend serializers.

**Why async:** the BFF runs as a Vercel function with a request duration and a
~4.5 MB body limit. Scans take 13–40 s on the current Gemini tier, so the upload
returns at once and the browser polls.

## Upload preparation

`lib/image.ts` accepts JPEG, PNG and WebP. Large photos are redrawn to at most
**2560 px** on the long edge (JPEG quality 0.9 → 0.7) to stay under 4.2 MB. Small
price text stays readable at that size; the backend makes its own smaller copy
for OCR.space. The server re-validates every upload; client checks are only for
quick feedback.

## Mapping to Simame pricing

The adapter is `lib/review.ts` (`buildReviewRows` → `matchExisting` →
`toAppliedPrices` / `toConfirmRows`). It maps onto the existing schema only:
item prices (`item_name`, `category` ∈ Wash Only · Wash & Iron · Iron Only,
`unit_price`) and the single per-kg price.

| Rule | Behaviour |
| --- | --- |
| Service type | Read from the row's variant, then its name ("Shirt ironing"), then its section heading ("IRONING / PRESSING"). A service word taken from the name is stripped ("Shirt ironing" → "Shirt", Iron Only). Rows naming no service go under the owner's chosen default (initially the active tab). |
| Washing only (ironing off) | Wash & Iron and Iron Only rows are unticked with "Your laundry doesn't offer ironing yet." They are never put into washing. |
| Ironing only | Iron / press / steam → Iron Only. Dry cleaning and express are held back with a note (not Simame service types). |
| PER_ITEM | One row per garment × service; the same garment with two services stays two rows. |
| PER_KG | Becomes the per-kg price. Only one is kept; extras are unticked. No minimum weight is invented. |
| BY_WEIGHT laundry | Per-item rows are held back ("Switch to Hybrid…"). |
| HYBRID | Items and per-kg are both kept; neither overwrites the other. |
| Sizes | Kept in the name: "Duvet (King)". |
| Money | Decimal strings end to end (`lib/money.ts`); never floats. |
| Currency | GH₵, GH¢, GHS, GHC, ₵ and "cedis" are cedis. If the list shows none, the owner ticks "These prices are in Ghana cedis" before applying. |

**Owner values win.** When a detected row matches an existing price, the row
shows `Existing: … / Detected: …` with **Keep existing** (default) / **Update
existing**; possible duplicates also offer **Create new**. Onboarding apply
merges rather than replaces, so rows the owner typed are untouched.

Note: onboarding stores weight pricing as tiers, and the existing submit turns
the smallest tier into the per-kg rate, minimum charge and minimum weight. A
scanned "GH¢18/kg" becomes a 1 kg tier, so the saved laundry gets a 1 kg / GH¢18
minimum. That is the tier design, not something the scanner adds.

## Resilience

* **Double click:** the Read button is replaced by the progress state on the
  first click; the server also refuses a second concurrent scan
  (`IMPORT_IN_PROGRESS`) and deduplicates identical images per owner.
* **Reload / navigation:** the job id is kept in `sessionStorage`
  (`simame_price_scan:onboarding|dashboard`). After a reload a scan still being
  read keeps loading and a ready one reopens its review. Finished, cancelled or
  foreign jobs are forgotten. While a review is open, closing the tab asks first.
  The onboarding form itself is saved as a draft (`connect_onboarding_draft`).
* **Lost response on confirm:** the server confirm is idempotent; a repeat
  returns `already_confirmed` rather than creating duplicates.

## Error states

`scanErrorText` in `lib/messages.ts` maps every code to owner wording:

| Code(s) | Owner sees |
| --- | --- |
| `COULD_NOT_READ_IMAGE`, `NO_PRICES_FOUND`, `INVALID_IMAGE`, `IMAGE_TOO_SMALL` | "We couldn't read this image clearly. Try another photo." |
| `UNSUPPORTED_FILE`, `EMPTY_FILE` | The server's plain message, or "Please choose a photo (JPEG, PNG or WebP)." |
| `FILE_TOO_LARGE`, `HTTP_413`, `IMAGE_DIMENSIONS_TOO_LARGE` | "This photo is too large. Please choose a smaller one." |
| `DAILY_LIMIT_REACHED` | Today's scan limit reached; continue manually. |
| `IMPORT_IN_PROGRESS` | A list is already being read; try again in a moment. |
| `SERVER_BUSY` | Reader busy; try again in a minute or continue manually. |
| anything else (provider quota/outage, 401/403/429/5xx, timeout) | "The price-list reader is temporarily unavailable. You can continue entering prices manually." |

Session expiry itself is handled by the shared API client (refresh, then
sign-in). Onboarding is never blocked by a scan failure.

## Configuration

Web: nothing AI-specific. The backend URL comes from `shared/lib/backend-url.ts`
(production host → production backend; `develop` / preview / staging →
staging backend). A local `next dev` with no `NEXT_PUBLIC_API_BASE_URL` falls back
to **production**; set it when working locally.

Backend (server only): `PRICE_LIST_AI_ENABLED`,
`PRICE_LIST_AI_LAUNDRY_ALLOWLIST` (laundry ids, or owner ids/emails for owners
still onboarding), `GEMINI_API_KEY`, `OCR_SPACE_API_KEY`,
`PRICE_LIST_BACKGROUND_MODE=thread`.

## Testing

* Unit/component (Vitest, runs in CI): `price-import/**/*.test.ts(x)`,
  `onboarding/components/steps/OnboardingPriceScan.test.tsx`,
  `business/components/DashboardPriceScan.test.tsx`,
  `onboarding/components/fields/PhoneField.test.tsx`.
* Live E2E (Playwright, **never in CI**, calls real Gemini / OCR.space):
  `e2e/price-import.live.spec.ts`. Skipped unless `E2E_LIVE_PRICE_IMPORT=1`; the
  header lists the env vars. Run it against a production build (`next build &&
  next start`), not `next dev`. Journeys: existing HYBRID owner (dashboard),
  new HYBRID owner (onboarding), washing only, ironing only and by weight (the
  last two of those finish onboarding and read the saved prices back).

## Rollout

Backend flag off → staging probe (`manage.py price_import_probe`) → allowlisted
QA laundry / owner in production → a few selected laundries → everyone. Manual
pricing stays available at every stage.
