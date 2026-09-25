import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImportDraftItem, ImportJob } from '../types'

const api = vi.hoisted(() => ({
  getScanAvailability: vi.fn(),
  scanPriceList: vi.fn(),
  cancelImport: vi.fn(),
  confirmImport: vi.fn(),
  getImportJob: vi.fn(),
  waitForJob: vi.fn(),
}))
vi.mock('../api', async (orig) => ({ ...(await orig<typeof import('../api')>()), ...api }))

import { ScanError } from '../api'
import { PriceListScanPanel } from './PriceListScanPanel'

const draft = (p: Partial<ImportDraftItem>): ImportDraftItem => ({
  id: Math.random().toString(36).slice(2),
  position: 0,
  item_name: 'Shirt',
  raw_name: 'Shirt',
  variant: '',
  category: '',
  pricing_method: 'PER_ITEM',
  suggested_price: '12.00',
  price_per_kg: null,
  surcharge_type: '',
  surcharge_amount: null,
  source_text: 'Shirt .... GH¢ 12',
  review_state: 'LOOKS_GOOD',
  warnings: [],
  confidence: 0.873422,
  match_type: 'NONE',
  matched_item: null,
  is_selected: true,
  ...p,
})

export const job = (drafts: ImportDraftItem[], extra: Partial<ImportJob> = {}): ImportJob => ({
  id: 'job-1',
  status: 'READY',
  review_required: true,
  provider: 'gemini',
  error: '',
  error_code: '',
  currency: 'GHS',
  document_warnings: [],
  summary: { total: drafts.length, looks_good: 0, please_check: 0, could_not_read: 0, possible_matches: 0 },
  served_from_cache: false,
  draft_items: drafts,
  created_at: '',
  completed_at: '',
  confirmed_at: null,
  ...extra,
})

const photo = () => new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'list.jpg', { type: 'image/jpeg' })

beforeEach(() => {
  vi.clearAllMocks()
  api.getScanAvailability.mockResolvedValue({ available: true })
  URL.createObjectURL = vi.fn(() => 'blob:preview')
  URL.revokeObjectURL = vi.fn()
  sessionStorage.clear()
})

const renderPanel = (onApply = vi.fn(async (_scan: unknown) => 'Added.')) =>
  render(
    <PriceListScanPanel
      context={{ pricingModel: 'HYBRID', ironingAvailable: true, existingItems: [], existingPerKg: null }}
      initialService="Wash Only"
      applyLabel="Apply prices"
      applyHint="hint"
      onApply={onApply}
    />,
  )

async function scanWith(result: ImportJob | Error) {
  if (result instanceof Error) api.scanPriceList.mockRejectedValue(result)
  else api.scanPriceList.mockResolvedValue(result)
  await screen.findByRole('button', { name: /take a photo/i })
  fireEvent.change(screen.getByTestId('file-input'), { target: { files: [photo()] } })
  expect(await screen.findByAltText(/your price list photo/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /read price list/i }))
}

describe('PriceListScanPanel', () => {
  it('renders nothing when scanning is unavailable (manual entry stays)', async () => {
    api.getScanAvailability.mockResolvedValue({ available: false })
    const { container } = renderPanel()
    await waitFor(() => expect(api.getScanAvailability).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()
  })

  it('offers camera capture and normal upload', async () => {
    renderPanel()
    await screen.findByRole('button', { name: /take a photo/i })
    expect(screen.getByRole('button', { name: /upload price list/i })).toBeInTheDocument()
    expect(screen.getByTestId('camera-input')).toHaveAttribute('capture', 'environment')
    expect(screen.getByTestId('file-input')).not.toHaveAttribute('capture')
  })

  it('preview offers use / retake / choose another / remove, and remove resets', async () => {
    renderPanel()
    await screen.findByRole('button', { name: /take a photo/i })
    fireEvent.change(screen.getByTestId('camera-input'), { target: { files: [photo()] } })
    await screen.findByAltText(/your price list photo/i)
    for (const name of [/read price list/i, /retake/i, /choose another/i, /remove/i]) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(screen.queryByAltText(/your price list photo/i)).not.toBeInTheDocument()
  })

  it('shows review states in plain words and no provider, model or confidence jargon', async () => {
    renderPanel()
    await scanWith(
      job([
        draft({}),
        draft({ item_name: 'Trouser', review_state: 'CHECK', warnings: ['PRICE_PROVIDER_DISAGREEMENT'] }),
        draft({ item_name: 'Tie', suggested_price: null, review_state: 'UNREADABLE', warnings: ['MISSING_PRICE'] }),
      ]),
    )
    expect(await screen.findByText(/we found 3 possible prices/i)).toBeInTheDocument()
    expect(screen.getByText('Looks good')).toBeInTheDocument()
    expect(screen.getByText('Please check')).toBeInTheDocument()
    expect(screen.getByText('Could not read')).toBeInTheDocument()
    expect(screen.getByText(/double-check this price/i)).toBeInTheDocument()
    const text = document.body.textContent ?? ''
    for (const jargon of ['gemini', 'ocr', 'provider', 'model', '0.87', 'confidence', 'json', '429', '503']) {
      expect(text.toLowerCase()).not.toContain(jargon)
    }
  })

  it.each([
    ['AI_TEMPORARILY_UNAVAILABLE', /temporarily unavailable.*manually/i],
    ['HTTP_429', /temporarily unavailable/i],
    ['HTTP_503', /temporarily unavailable/i],
    ['TIMEOUT', /temporarily unavailable/i],
    ['COULD_NOT_READ_IMAGE', /couldn't read this image clearly/i],
    ['FILE_TOO_LARGE', /too large/i],
  ])('failure %s shows owner-safe copy', async (code, expected) => {
    renderPanel()
    await scanWith(new ScanError(code, 'Gemini 429 RESOURCE_EXHAUSTED'))
    expect(await screen.findByText(expected)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/RESOURCE_EXHAUSTED|Gemini/)
    // The photo is kept so the owner can retry or choose another.
    expect(screen.getByRole('button', { name: /read price list/i })).toBeInTheDocument()
  })

  it('requires confirming cedis when the currency was not printed', async () => {
    renderPanel()
    await scanWith(job([draft({})], { currency: '', document_warnings: ['CURRENCY_UNCONFIRMED'] }))
    const apply = await screen.findByRole('button', { name: /apply prices/i })
    expect(apply).toBeDisabled()
    fireEvent.click(screen.getByLabelText(/ghana cedis/i))
    expect(apply).toBeEnabled()
  })

  it('apply passes the owner-edited rows and nothing is applied before the click', async () => {
    const onApply = vi.fn(async (_scan: unknown) => 'Added 1 item price to your form.')
    renderPanel(onApply)
    await scanWith(job([draft({})]))
    const price = await screen.findByLabelText('Price')
    fireEvent.change(price, { target: { value: '13.50' } })
    expect(onApply).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /apply prices/i }))
    await waitFor(() => expect(onApply).toHaveBeenCalledTimes(1))
    const scan = onApply.mock.calls[0][0] as unknown as { rows: Array<{ price: string }> }
    expect(scan.rows[0].price).toBe('13.50')
    expect(await screen.findByText(/added 1 item price/i)).toBeInTheDocument()
  })

  describe('surviving a reload', () => {
    const KEY = 'simame_price_scan:onboarding'
    const renderScoped = () =>
      render(
        <PriceListScanPanel
          context={{ pricingModel: 'HYBRID', ironingAvailable: true, existingItems: [], existingPerKg: null }}
          applyLabel="Apply prices"
          applyHint="hint"
          onApply={vi.fn(async () => 'Added.')}
          scope="onboarding"
        />,
      )

    it('remembers the job as soon as it exists and forgets it on Discard', async () => {
      api.scanPriceList.mockImplementation(async (_b, _f, _s, onCreated?: (id: string) => void) => {
        onCreated?.('job-1')
        return job([draft({})])
      })
      renderScoped()
      await screen.findByRole('button', { name: /take a photo/i })
      fireEvent.change(screen.getByTestId('file-input'), { target: { files: [photo()] } })
      fireEvent.click(await screen.findByRole('button', { name: /read price list/i }))
      await screen.findByText(/we found 1 possible price/i)
      expect(sessionStorage.getItem(KEY)).toBe('job-1')
      fireEvent.click(screen.getByRole('button', { name: /discard/i }))
      expect(sessionStorage.getItem(KEY)).toBeNull()
    })

    it('reopens a ready scan after a reload without uploading again', async () => {
      sessionStorage.setItem(KEY, 'job-1')
      const ready = job([draft({ item_name: 'Trouser', suggested_price: '15.00' })])
      api.getImportJob.mockResolvedValue(ready)
      api.waitForJob.mockResolvedValue(ready)
      renderScoped()
      expect(await screen.findByDisplayValue('Trouser')).toBeInTheDocument()
      expect(api.getImportJob).toHaveBeenCalledWith('job-1', expect.anything())
      expect(api.scanPriceList).not.toHaveBeenCalled()
    })

    it('keeps waiting for a scan that was still being read', async () => {
      sessionStorage.setItem(KEY, 'job-1')
      api.getImportJob.mockResolvedValue(job([], { status: 'PROCESSING' }))
      let finish!: (j: ImportJob) => void
      api.waitForJob.mockReturnValue(new Promise((r) => { finish = r }))
      renderScoped()
      expect(await screen.findByText(/reading your price list/i)).toBeInTheDocument()
      finish(job([draft({})]))
      expect(await screen.findByText(/we found 1 possible price/i)).toBeInTheDocument()
    })

    it('forgets a scan that was already confirmed or cancelled', async () => {
      sessionStorage.setItem(KEY, 'job-1')
      api.getImportJob.mockResolvedValue(job([], { status: 'CONFIRMED' }))
      renderScoped()
      expect(await screen.findByRole('button', { name: /take a photo/i })).toBeInTheDocument()
      expect(sessionStorage.getItem(KEY)).toBeNull()
      expect(api.waitForJob).not.toHaveBeenCalled()
    })

    it("forgets a job the server won't return (another owner's, or gone)", async () => {
      sessionStorage.setItem(KEY, 'someone-elses-job')
      api.getImportJob.mockRejectedValue(new ScanError('HTTP_404', 'Not found'))
      renderScoped()
      expect(await screen.findByRole('button', { name: /take a photo/i })).toBeInTheDocument()
      expect(sessionStorage.getItem(KEY)).toBeNull()
    })

    it('asks before leaving the page while review edits are open', async () => {
      renderPanel()
      await scanWith(job([draft({})]))
      await screen.findByText(/we found 1 possible price/i)
      const leave = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(leave)
      expect(leave.defaultPrevented).toBe(true)
      fireEvent.click(screen.getByRole('button', { name: /discard/i }))
      const later = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(later)
      expect(later.defaultPrevented).toBe(false)
    })
  })
})
