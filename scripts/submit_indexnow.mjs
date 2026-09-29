/**
 * Simame IndexNow submission
 * Reads the live sitemap and submits every URL to IndexNow, which shares it
 * with Bing (and so ChatGPT search, Copilot, DuckDuckGo, Yahoo), Yandex,
 * Seznam and Naver. Google does not use IndexNow: use Search Console for it.
 *
 * Run after a production deploy that adds or changes public pages:
 *   node scripts/submit_indexnow.mjs
 */

const INDEXNOW_KEY = '4f89d3a7e6b241c890f5a7e1c3b5d2e4'
const INDEXNOW_HOST = 'simame.tech'
const KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`
const SITEMAP_URL = `https://${INDEXNOW_HOST}/sitemap.xml`

async function getSitemapUrls() {
  const res = await fetch(SITEMAP_URL)
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
}

async function submitIndexNow() {
  const urlList = await getSitemapUrls()
  if (urlList.length === 0) throw new Error('Sitemap has no URLs; is indexing disabled on this deployment?')

  console.log(`Submitting ${urlList.length} URLs from ${SITEMAP_URL} to IndexNow...`)
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList }),
  })

  console.log(`IndexNow API response: ${res.status} ${res.statusText}`)
  if (res.status !== 200 && res.status !== 202) {
    console.log(await res.text())
    process.exitCode = 1
  }
}

submitIndexNow().catch((err) => {
  console.error('IndexNow submission failed:', err)
  process.exitCode = 1
})
