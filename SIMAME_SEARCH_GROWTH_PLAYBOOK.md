# Simame Search Growth Playbook

Date: 2026-09-29
Goal: people who search for Simame, Connect Laundry, or laundry services in Ghana find Simame and can install it from Google Play.
No new app build is needed for anything in this document. Website changes deploy through Vercel. Play Store listing changes are made in Play Console and go through a short listing review.

## Where things stand (2026-09-29)

| Item | Status |
| --- | --- |
| Google Play listing | Live: `com.connectlaundry.app`, "Simame - Laundry Connect", developer Kusantec Solutions, 0+ installs, no ratings yet |
| Play listing links back to simame.tech | Yes (website and privacy policy) |
| simame.tech in search engines | Not indexed yet. A web search for `"simame.tech"` returns nothing, and a search for "Simame laundry app Ghana" returns another company's app first |
| iPhone app | None on the App Store (checked via the iTunes Search API). The website no longer claims one |

The single biggest blocker is indexing. Until Google has crawled simame.tech, no amount of on-page SEO shows up anywhere.

## What changed on the website

- `/app` now targets "laundry app Ghana": new title and copy, download steps, and six FAQs. The false iPhone claim is gone.
- New `/connect-laundry` page for "Connect Laundry", "Laundry Connect" and "Connect Laundry app" searches.
- New `/guides` hub with nine full laundry guides. They target the generic "laundry" questions people search in Ghana: choosing a laundry service, dry cleaning vs washing, removing palm oil, red soil and sweat stains, hostel laundry for students, getting clothes ready for pickup, keeping whites white, washing African print, musty smells in the rainy season, and ironing a shirt.
- New `/download` short link that redirects to Google Play with install tracking. Add `?src=` to tag a campaign, e.g. `simame.tech/download?src=knust-flyer`. Installs appear in Play Console, under the acquisition report's UTM section.
- The homepage's empty call-to-action box is now a "Get the Simame laundry app" section with the Play badge.
- Removed the two "Download on the App Store" buttons. They linked to `#`, which broke user trust and wasted a link.
- One `MobileApplication` schema entity for the app (Android only, no invented ratings) is used on both the homepage and `/app`.
- The sitemap grew from 14 to 25 URLs, with real last-modified dates.
- The IndexNow script now reads the live sitemap, so new pages are always included.
- Added `/llms.txt`, a short fact sheet for AI assistants that read it.

## 1. Do these first (founder actions, about 30 minutes)

### Google Search Console (this unlocks Google)

1. Go to https://search.google.com/search-console and add a **Domain** property for `simame.tech`.
2. Add the TXT record Google gives you at the domain registrar's DNS settings, then click Verify. If DNS access is hard, use the "URL prefix" method with the HTML tag instead: put the token in Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Production) and redeploy. The layout already reads it.
3. Under Sitemaps, submit `https://simame.tech/sitemap.xml`.
4. Under URL Inspection, request indexing for these URLs, one at a time, most important first. There is a daily quota.
   - `https://simame.tech/`
   - `https://simame.tech/app`
   - `https://simame.tech/connect-laundry`
   - `https://simame.tech/guides`
   - `https://simame.tech/about`

Google says crawling "can take anywhere from a few days to a few weeks".

### Bing Webmaster Tools (covers Bing, Yahoo, DuckDuckGo, ChatGPT search and Copilot)

1. Go to https://www.bing.com/webmasters and choose "Import from Google Search Console". This takes one click once GSC is verified.
2. Submit the same sitemap. IndexNow (already set up) pings Bing whenever pages change.

## 2. Google Play listing (Play Console → Grow users → Store presence → Main store listing)

Play Store ranking uses the listing text plus installs, ratings, reviews and retention. The text below follows Google Play's metadata policy: no "best", "#1" or "top" claims, no prices or promotions in the title, no testimonials, no other brands, and no keyword lists.

**App name (max 30).** Recommended: keep `Simame - Laundry Connect` (24 characters). It matches the website and schema, and it matches both "laundry" and "connect laundry" searches.
The alternative is `Simame: Laundry & Dry Cleaning` (30), which adds "dry cleaning" as a title keyword but drops "Connect". If you switch, the website's `APP_NAME` in `src/shared/lib/seo.ts` must change to match.

**Short description (max 80):**

```
Laundry app for Ghana: pickup, delivery, wash & fold, dry cleaning and ironing
```

(78 characters. The current one is fine, but this adds "laundry app", "wash & fold" and "ironing".)

**Full description (max 4000).** This version is 2,444 characters. It replaces "top-rated" and "zero hidden fees", which can read as ranking or performance claims under Play policy.
Keep the payment list and the Accra/Kumasi line only if they are still true today. Both were carried over from the current listing.

```
Simame - Laundry Connect is the laundry app for Ghana. Find laundry services near you, book laundry pickup and delivery, and get your clothes washed, dry cleaned or ironed without leaving home.

Whether you need everyday wash and fold, dry cleaning for a suit or kente, or ironing for the week's work shirts, Simame connects you with local partner laundries and dry cleaners and lets you order in a few taps.

WHAT YOU CAN DO WITH SIMAME
• Find laundries near you: browse partner laundries and dry cleaners around your location, with their services and prices in one place.
• Book pickup and delivery: choose your services, set your address and pick a collection time that suits you. No calling round, no carrying heavy bags.
• Wash and fold: everyday clothes, bedsheets and towels washed, dried and neatly folded.
• Dry cleaning: suits, blazers, dresses, silk, lace and traditional wear handled by partner dry cleaners.
• Ironing and steam pressing: work shirts, trousers, uniforms and outfits pressed and ready to wear.
• See prices before you order: item and weight prices shown upfront, with any delivery fee shown before you confirm.
• Track your order: follow your laundry from pickup through washing to delivery, with notifications as the status changes.
• Pay your way: Mobile Money (MTN MoMo, Telecel Cash, AT Money), debit or credit card, or cash on delivery.
• Report an issue: if anything is wrong with an order, report it from the order screen.

HOW IT WORKS
1. Open Simame and choose a laundry near you.
2. Select your items and services: washing, dry cleaning or ironing.
3. Set your pickup address and time.
4. Hand over your clothes and track your order in the app.
5. Receive clean, fresh clothes at your door.

GREAT FOR
• Busy workers who want laundry off their to-do list
• Students in hostels and halls
• Families with bedding, curtains and household items
• Anyone who needs dry cleaning for special occasions

WHERE SIMAME WORKS
Simame is available in Accra, Kumasi and other areas of Ghana where partner laundries operate. Open the app to see the laundries that serve your location.

FOR LAUNDRY BUSINESSES
Run a laundry or dry cleaning business? Join Simame to receive orders online and manage your prices, opening hours and staff at simame.tech/for-laundries.

Simame was founded as Connect Laundry. Same team, same app, one official name.

Website: https://simame.tech
Support: info@simame.tech
Follow us: @simameapp
```

**Also in Play Console:**

- **Store settings → App tags:** add the closest available tags, e.g. laundry, home services, dry cleaning.
- **Store settings → Contact details:** the website is set correctly. Consider showing `info@simame.tech` instead of `appreview@simame.tech` to customers.
- **Promo video:** upload a 30–60 second screen recording to YouTube @simameapp showing a booking, and add the link. It also becomes YouTube search content.
- **Screenshots:** the listing currently repeats the same 1920×1080 images several times. Use 4–8 distinct phone screenshots, each with one short caption: Find laundries near you, Book pickup, Track your order, Pay with MoMo.
- **Ratings:** with 0 ratings, Google Play and Google Search show no stars. After a completed order, ask happy customers to rate the app on Google Play (WhatsApp or SMS is fine), and reply to every review in Play Console. Never offer rewards for ratings or buy reviews. Play removes them and can suspend the app.
  An in-app review prompt needs a native module (`expo-store-review`) the current build does not include, so it waits for the next build.

## 3. Off-site signals (what makes Google trust a new site)

Links and mentions from other real sites are the strongest signal a new domain can earn. In order of value:

1. **Social bios.** On Instagram, X, YouTube, TikTok, Facebook and LinkedIn, use the name `Simame - Laundry Connect`, the same one-line description, and the link `https://simame.tech/download?src=<platform>`.
   Confirm which of TikTok, Facebook, LinkedIn and WhatsApp are officially ours, so they can be added to the site's `sameAs` schema in `src/shared/lib/social.ts`.
2. **Partner laundries.** Ask each partner to add a "Book on Simame" link (badge code on `/for-laundries`) to their Google Business Profile, WhatsApp Business catalogue, Instagram bio and website, using `simame.tech/download?src=<laundry-name>`. Partner Business Profiles are how Simame shows up in "laundry near me" map results.
3. **Business directories.** List Simame with exactly the same name, email, phone and website everywhere:
   - GhanaYello: https://www.ghanayello.com (free basic listing)
   - BusinessGhana: https://www.businessghana.com
   - Yellow Pages Ghana: https://yellowpagesghana.com.gh
   - Crunchbase and a LinkedIn company page
   - Product Hunt launch, once there are a few reviews
4. **Press.** Pitch a short launch story (a Ghanaian laundry app, founded as Connect Laundry, now live on Google Play) to Ghana tech and business media, e.g. TechCabal, Techpoint Africa, MyJoyOnline, Citinewsroom, Pulse Ghana and GhanaWeb business. Point them to `simame.tech/press`. One real news article linking to simame.tech is worth more than dozens of directory listings.
5. **Campus and flyers.** QR codes on flyers and hostel notice boards pointing to `simame.tech/download?src=<campus>-flyer`. Every install is then attributed in Play Console.
6. **Google Business Profile for Simame itself.** Only if eligible. Google requires a physical location customers visit, or a business that travels to customers within about 2 hours of its base, and online-only businesses are not eligible. If Simame's own staff or riders collect from customers, it can register as a service-area business. The name must be exactly "Simame", with no keywords added.

## 4. Deliberately not done

- **"Simami".** Simami is a different, active laundry company in Ghana with its own Google Play app (`com.simamigh.simami`) and website (simamigh.com). Using their name in our metadata, schema or Play listing would break Google Play's metadata policy, which forbids references to other apps and brands. It also risks a trademark complaint that could take our listing down.
  Our defence is clear spelling everywhere (S-I-M-A-M-E), which the site already does, and a strong brand search result once indexed. The existing SEO test keeps "Simami" out of all metadata and schema.
- **Ranking for "laundry" everywhere.** No legitimate method makes one app appear for every laundry search. Google localises results, so someone in Accra searching "laundry app" sees different results from someone in London, and Simame only serves Ghana. Aim for:
  - brand searches (Simame, Simame app, Connect Laundry), typically within days to weeks of indexing;
  - Ghana laundry searches ("laundry app Ghana", "laundry pickup Accra"), over months as installs, ratings and links grow;
  - "how to" laundry questions, through the guides.
- **City and provider pages** (e.g. "laundry in Kumasi"). The production API needs a login to list laundries, and the site's coverage gate (`src/shared/lib/coverage.ts`) keeps city pages unindexed until real partner coverage is confirmed. With a confirmed list of active partner laundries and their areas, these are the next pages to build. They are the best route to "laundry near me" searches.

## 5. After deploy (engineering)

1. Merge and deploy to production.
2. Run `node scripts/submit_indexnow.mjs` to push all 25 URLs to Bing and the other IndexNow engines.
3. Check `https://simame.tech/download` redirects to Google Play.
4. Validate `/app`, `/connect-laundry` and one guide in Google's Rich Results Test (https://search.google.com/test/rich-results).

## Sources

- Google Play metadata policy: https://support.google.com/googleplay/android-developer/answer/9898842
- Google, ask Google to recrawl URLs: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google, software app structured data: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Google Business Profile guidelines: https://support.google.com/business/answer/3038177
- IndexNow: https://www.indexnow.org/documentation
- Ghana directories: https://www.ghanayello.com, https://www.businessghana.com, https://yellowpagesghana.com.gh
