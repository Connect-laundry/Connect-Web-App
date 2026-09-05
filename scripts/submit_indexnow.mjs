/**
 * Simame IndexNow Submission Script
 * Submits the latest canonical URLs to IndexNow (Bing, Yandex, Seznam, Naver)
 */

const INDEXNOW_KEY = '4f89d3a7e6b241c890f5a7e1c3b5d2e4'
const INDEXNOW_HOST = 'simame.tech'
const KEY_LOCATION = `https://simame.tech/${INDEXNOW_KEY}.txt`

const CANONICAL_URLS = [
  'https://simame.tech/',
  'https://simame.tech/about',
  'https://simame.tech/app',
  'https://simame.tech/services',
  'https://simame.tech/how-it-works',
  'https://simame.tech/for-laundries',
  'https://simame.tech/locations',
  'https://simame.tech/campuses',
  'https://simame.tech/technology',
  'https://simame.tech/press',
  'https://simame.tech/contact',
  'https://simame.tech/privacy',
  'https://simame.tech/terms',
  'https://simame.tech/account-deletion',
]

async function submitIndexNow() {
  console.log(`Submitting ${CANONICAL_URLS.length} URLs to IndexNow API...`)
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: CANONICAL_URLS,
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    console.log(`IndexNow API Response Status: ${res.status} ${res.statusText}`)
    if (res.status === 200 || res.status === 202) {
      console.log('✅ IndexNow submission successful!')
    } else {
      const text = await res.text()
      console.log(`Response text: ${text}`)
    }
  } catch (err) {
    console.error('❌ Error submitting to IndexNow:', err)
  }
}

submitIndexNow()
