/**
 * LIVE end-to-end test of photo → price list, against a real backend with
 * real AI providers. Skipped unless E2E_LIVE_PRICE_IMPORT=1 — never in CI
 * (it calls paid/quota-limited APIs).
 *
 *   E2E_LIVE_PRICE_IMPORT=1 E2E_BASE_URL=http://127.0.0.1:3100 \
 *   E2E_IMAGE=/path/price-list.jpg \
 *   E2E_EXISTING_OWNER=... E2E_NEW_OWNER=... E2E_PASSWORD=... \
 *   E2E_FIXTURES=/dir/holding/washing.jpg+ironing.jpg+weight.jpg \
 *   E2E_WASH_OWNER=... E2E_IRON_OWNER=... E2E_KG_OWNER=... \
 *   npx playwright test e2e/price-import.live.spec.ts --project=chromium
 *   
 * The existing owner needs a HYBRID laundry; every other owner no laundry yet
 * (the washing-only and by-weight journeys finish onboarding and create one).
 */
import { expect, test, type Page } from '@playwright/test'

const live = process.env.E2E_LIVE_PRICE_IMPORT === '1'
const base = process.env.E2E_BASE_URL || 'http://127.0.0.1:3100'
const image = process.env.E2E_IMAGE || ''
const password = process.env.E2E_PASSWORD || ''
const fixtures = process.env.E2E_FIXTURES || ''

test.skip(!live, 'live price-import E2E only runs with E2E_LIVE_PRICE_IMPORT=1')
test.setTimeout(240_000)

async function login(page: Page, email: string) {
  await page.goto(`${base}/auth/login`)
  await page.getByRole('button', { name: /sign in/i }).waitFor()
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  // Dev servers hydrate late; retry until the app's own login call happens.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = page.waitForResponse((r) => r.url().includes('/api/auth/login'), { timeout: 8_000 }).catch(() => null)
    await page.getByRole('button', { name: /sign in/i }).click()
    if (await response) break
  }
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/login'), { timeout: 60_000 })
}

async function scan(page: Page, photo = image) {
  const requests: string[] = []
  page.on('request', (r) => requests.push(r.url()))
  await page.getByRole('button', { name: /upload price list/i }).waitFor({ timeout: 60_000 })
  await page.getByTestId('file-input').setInputFiles(photo)
  await expect(page.getByAltText(/your price list photo/i)).toBeVisible()
  await page.getByRole('button', { name: /read price list/i }).click()
  await expect(page.getByText(/reading your price list|finding services/i)).toBeVisible()
  await expect(page.getByText(/possible price/i)).toBeVisible({ timeout: 110_000 })
  // The browser only ever talks to Simame (the /api/proxy BFF), never to AI services.
  expect(requests.filter((u) => /googleapis|ocr\.space/.test(u))).toEqual([])
  const body = (await page.locator('body').innerText()).toLowerCase()
  for (const jargon of ['gemini', 'ocr.space', 'provider', 'resource_exhausted']) expect(body).not.toContain(jargon)
  // The review must fit the screen: no sideways scrolling, even at 320 px.
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
  expect(widths[0]).toBeLessThanOrEqual(widths[1])
}

type Seed = {
  currentStep: number
  pricing_model: 'BY_ITEM' | 'BY_WEIGHT' | 'HYBRID'
  ironing_available?: boolean
  phone?: string
  weightTiers?: Array<{ weight_kg: string; price: string }>
}

/**
 * Resume the wizard at a later step using its own saved-draft format (the
 * Location step needs device GPS / place search, not what these tests cover).
 * Seeds once, so a reload keeps whatever the test did since.
 */
async function seedOnboarding(page: Page, seed: Seed) {
  await page.addInitScript((sd: Seed) => {
    if (localStorage.getItem('e2e_seeded')) return
    localStorage.setItem('e2e_seeded', '1')
    const phone = sd.phone || '0241110002'
    localStorage.setItem('connect_onboarding_draft', JSON.stringify({
      currentStep: sd.currentStep,
      formValues: {
        name: `E2E ${sd.pricing_model} Laundry`, description: 'Campus laundry near Legon.', phone_number: phone,
        address: 'Legon Boundary Road', city: 'Accra', latitude: '5.6508', longitude: '-0.1870',
        pricing_model: sd.pricing_model, price_range: '$$', estimated_delivery_hours: '24', delivery_fee: '0', pickup_fee: '0',
        min_order: '0', service_radius_km: '5', is_eco_friendly: false, ironing_available: sd.ironing_available ?? true,
        base_price_per_kg: '', minimum_charge: '0', minimum_order_weight_kg: '', rounding_strategy: 'NONE',
        use_business_phone_for_payout: true, payout_method: 'MOBILE_MONEY', payout_provider: 'MTN',
        payout_phone: phone, payout_account_name: '', payout_confirmed: true,
      },
      hours: [1, 2, 3, 4, 5, 6, 7].map((day) => ({ day, label: `D${day}`, is_closed: false, opening_time: '08:00', closing_time: '18:00' })),
      priceItems: [],
      weightTiers: sd.weightTiers ?? [],
      express: {},
    }))
  }, seed)
}

type DraftItem = { item_name: string; category: string; unit_price: string }
const onboardingDraft = async (page: Page) =>
  JSON.parse((await page.evaluate(() => localStorage.getItem('connect_onboarding_draft'))) || '{}') as {
    priceItems: DraftItem[]
    weightTiers: Array<{ weight_kg: string; price: string }>
  }

/** Clicks Next through the remaining steps, submits, and waits for the pending page. */
async function finishOnboarding(page: Page) {
  // Price list / pricing → Payout Account → Review. Wait for each step to settle.
  await page.getByRole('button', { name: /^next/i }).click()
  await expect(page.getByText('Set up where to receive your Simame earnings.')).toBeVisible()
  const confirmPayout = page.getByRole('button', { name: /confirm payout account/i })
  if (await confirmPayout.isVisible()) await confirmPayout.click()
  await page.getByRole('button', { name: /^next/i }).click()
  const complete = page.getByRole('button', { name: /complete registration/i })
  await expect(complete).toBeVisible()
  await complete.click()
  await page.waitForURL(/\/onboarding\/pending/, { timeout: 60_000 })
}

/** Reads the owner's saved pricing back from the server (through the web BFF). */
async function savedPricing(page: Page) {
  const get = async (path: string) => (await (await page.request.get(`${base}/api/proxy/laundries/dashboard/${path}`)).json()).data
  const items = (await get('pricing-items')) as DraftItem[] | { results: DraftItem[] }
  return { items: Array.isArray(items) ? items : items.results, weight: await get('weight-pricing') }
}

test('existing HYBRID owner: scan → review → keep/update → confirm → reload persists', async ({ page }) => {
  await login(page, process.env.E2E_EXISTING_OWNER || '')
  await page.goto(`${base}/business`)
  await page.getByRole('tab', { name: /services & pricing/i }).click()
  await scan(page)
  await page.screenshot({ path: 'test-results/price-import-dashboard-review.png', fullPage: true })

  // Owner edits one detected value before importing.
  const trouserRow = page.locator('[data-testid^="review-row-"]').filter({ has: page.locator('input[value="Trouser"]') })
  await trouserRow.getByRole('textbox', { name: 'Price', exact: true }).fill('16')

  const confirm = page.getByRole('button', { name: /confirm & import/i })
  await expect(confirm).toBeEnabled()
  await confirm.click()
  await expect(page.getByText(/saved \d+ new/i)).toBeVisible({ timeout: 30_000 })

  await page.reload()
  await page.getByRole('tab', { name: /services & pricing/i }).click()
  await expect(page.getByText(/trouser/i).first()).toBeVisible()
})

test('new owner (no laundry yet): onboarding scan fills the form, HYBRID keeps items + per-kg, reload persists', async ({ page }) => {
  await seedOnboarding(page, { currentStep: 4, pricing_model: 'HYBRID', weightTiers: [{ weight_kg: '5', price: '80' }] })
  await login(page, process.env.E2E_NEW_OWNER || '')
  await page.goto(`${base}/onboarding/setup`)
  await expect(page.getByText(/pick a service/i)).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: /wash \+ ironing/i }).first().click()

  await scan(page)
  await page.screenshot({ path: 'test-results/price-import-onboarding-review.png', fullPage: true })
  const trouser = page.locator('[data-testid^="review-row-"]').filter({ has: page.locator('input[value="Trouser"]') })
  await trouser.getByRole('textbox', { name: 'Price', exact: true }).fill('17')
  await page.getByRole('button', { name: /apply prices/i }).click()
  await expect(page.getByText(/to your form/i)).toBeVisible()

  let saved = await onboardingDraft(page)
  const rows = saved.priceItems.map((i) => `${i.item_name}|${i.category}|${i.unit_price}`)
  expect(rows).toEqual(expect.arrayContaining(['Trouser|Wash & Iron|17.00', 'Shirt|Wash & Iron|13.00']))
  expect(saved.weightTiers).toEqual([{ weight_kg: '1', price: '20.00' }, { weight_kg: '5', price: '80' }])

  // Draft survives a reload; nothing was saved to the server by scanning.
  await page.reload()
  await expect(page.getByText(/pick a service/i)).toBeVisible({ timeout: 30_000 })
  saved = await onboardingDraft(page)
  expect(saved.priceItems.length).toBe(rows.length)
  await page.getByRole('button', { name: /wash \+ ironing/i }).first().click()
  await expect(page.locator('input[value="17.00"]')).toBeVisible()
})

test.describe('pricing journeys with dedicated fixtures', () => {
  test.skip(!fixtures, 'needs E2E_FIXTURES')
  const fx = (name: string) => `${fixtures}/${name}.jpg`
  // "name|service|price" rows. The reader may pluralise a name (Trouser/Trousers);
  // the service type and price must be exact.
  const expectRow = (rows: string[], name: string, service: string, price: string) =>
    expect(rows.some((r) => {
      const [n, s, p] = r.split('|')
      return (n === name || n === `${name}s`) && s === service && p === price
    }), `${name} | ${service} | ${price} in ${JSON.stringify(rows)}`).toBe(true)

  test('A. washing only: wash prices fill Wash Only, the ironing price is held back, submit saves only washing', async ({ page }) => {
    await seedOnboarding(page, { currentStep: 4, pricing_model: 'BY_ITEM', ironing_available: false, phone: '0241110003' })
    await login(page, process.env.E2E_WASH_OWNER || '')
    await page.goto(`${base}/onboarding/setup`)
    await expect(page.getByText(/pick a service/i)).toBeVisible({ timeout: 30_000 })
    await scan(page, fx('washing'))
    await page.screenshot({ path: 'test-results/journey-washing-review.png', fullPage: true })
    await expect(page.getByText(/doesn't offer ironing/i).first()).toBeVisible()

    // Owner corrects one price, then applies.
    await page.locator('[data-testid^="review-row-"]').filter({ has: page.locator('input[value^="Towel"]') }).getByRole('textbox', { name: 'Price', exact: true }).fill('7.50')
    await page.getByRole('button', { name: /apply prices/i }).click()
    await expect(page.getByText(/to your form/i)).toBeVisible()

    const { priceItems, weightTiers } = await onboardingDraft(page)
    const rows = priceItems.map((i) => `${i.item_name}|${i.category}|${i.unit_price}`)
    expectRow(rows, 'Shirt', 'Wash Only', '10.00')
    expectRow(rows, 'Trouser', 'Wash Only', '15.00')
    expectRow(rows, 'Towel', 'Wash Only', '7.50')
    expect(rows.some((r) => /^Bedsheet/i.test(r) && r.endsWith('|Wash Only|20.00'))).toBe(true)
    expect(priceItems.every((i) => i.category === 'Wash Only')).toBe(true)
    expect(priceItems.some((i) => i.unit_price === '8.00')).toBe(false)
    expect(weightTiers).toEqual([])

    await finishOnboarding(page)
    const saved = await savedPricing(page)
    const live = saved.items.map((i) => `${i.item_name}|${i.category}|${Number(i.unit_price).toFixed(2)}`)
    expectRow(live, 'Shirt', 'Wash Only', '10.00')
    expectRow(live, 'Trouser', 'Wash Only', '15.00')
    expectRow(live, 'Towel', 'Wash Only', '7.50')
    expect(saved.items.every((i) => i.category === 'Wash Only')).toBe(true)
    expect(saved.items).toHaveLength(priceItems.length)
  })

  test('B. ironing only: pressing prices fill the Ironing only tab and nothing else', async ({ page }) => {
    await seedOnboarding(page, { currentStep: 4, pricing_model: 'BY_ITEM', ironing_available: true, phone: '0241110004' })
    await login(page, process.env.E2E_IRON_OWNER || '')
    await page.goto(`${base}/onboarding/setup`)
    await expect(page.getByText(/pick a service/i)).toBeVisible({ timeout: 30_000 })
    await page.getByRole('button', { name: /ironing only/i }).first().click()
    await scan(page, fx('ironing'))
    await page.screenshot({ path: 'test-results/journey-ironing-review.png', fullPage: true })
    await page.getByRole('button', { name: /apply prices/i }).click()
    await expect(page.getByText(/to your form/i)).toBeVisible()

    const { priceItems, weightTiers } = await onboardingDraft(page)
    const rows = priceItems.map((i) => `${i.item_name}|${i.category}|${i.unit_price}`)
    expectRow(rows, 'Shirt', 'Iron Only', '6.00')
    expectRow(rows, 'Trouser', 'Iron Only', '7.00')
    expect(rows.some((r) => /^Kaba/i.test(r) && r.endsWith('|Iron Only|12.00'))).toBe(true)
    expect(rows.some((r) => /^Suit/i.test(r) && r.endsWith('|Iron Only|20.00'))).toBe(true)
    expect(priceItems.every((i) => i.category === 'Iron Only')).toBe(true)
    expect(weightTiers).toEqual([])
  })

  test('C. by weight: the per-kg price fills the weight tariff, the item price is held back, submit saves it', async ({ page }) => {
    await seedOnboarding(page, { currentStep: 3, pricing_model: 'BY_WEIGHT', phone: '0241110005' })
    await login(page, process.env.E2E_KG_OWNER || '')
    await page.goto(`${base}/onboarding/setup`)
    await scan(page, fx('weight'))
    await page.screenshot({ path: 'test-results/journey-weight-review.png', fullPage: true })
    // A per-item row, when one was read, is held back rather than applied.
    if (await page.locator('input[value^="Duvet"]').count()) await expect(page.getByText(/prices by weight/i).first()).toBeVisible()
    await page.getByRole('button', { name: /apply prices/i }).click()
    await expect(page.getByText(/to your form/i)).toBeVisible()

    const { priceItems, weightTiers } = await onboardingDraft(page)
    expect(weightTiers).toEqual([{ weight_kg: '1', price: '18.00' }])
    expect(priceItems).toEqual([])

    await finishOnboarding(page)
    const saved = await savedPricing(page)
    expect(saved.items).toEqual([])
    expect(Number(saved.weight.base_price_per_kg)).toBe(18)
  })
})
