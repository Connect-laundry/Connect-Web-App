import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const client = vi.hoisted(() => ({ apiClient: vi.fn() }))
vi.mock('@/shared/api/client', () => client)

import { SCAN_TIMEOUT_MS, ScanError, confirmImport, scanPriceList } from './api'

const env = (data: unknown) => ({ status: 'success', message: 'ok', data })

beforeEach(() => {
  vi.useFakeTimers()
  client.apiClient.mockReset()
})
afterEach(() => vi.useRealTimers())

describe('scanPriceList', () => {
  it('uploads to the Simame backend with async=1 and polls until READY', async () => {
    client.apiClient
      .mockResolvedValueOnce(env({ id: 'j1', status: 'PROCESSING' }))
      .mockResolvedValueOnce(env({ id: 'j1', status: 'PROCESSING' }))
      .mockResolvedValueOnce(env({ id: 'j1', status: 'READY', draft_items: [] }))
    const p = scanPriceList(new Blob(['x']), 'l.jpg')
    await vi.advanceTimersByTimeAsync(5000)
    const job = await p
    expect(job.status).toBe('READY')
    const [url, opts] = client.apiClient.mock.calls[0]
    expect(url).toBe('/laundries/dashboard/price-imports/?async=1')
    expect(opts.method).toBe('POST')
    expect(opts.body).toBeInstanceOf(FormData)
    expect(client.apiClient.mock.calls[1][0]).toBe('/laundries/dashboard/price-imports/j1/')
    // Only relative Simame paths: the browser never calls Google or OCR.space.
    for (const [u] of client.apiClient.mock.calls) expect(String(u)).not.toMatch(/googleapis|ocr\.space|^https?:/)
  })

  it('reports the job id before polling, so a reload can resume it', async () => {
    const seen: string[] = []
    client.apiClient
      .mockResolvedValueOnce(env({ id: 'j1', status: 'PROCESSING' }))
      .mockImplementationOnce(async () => {
        seen.push('poll')
        return env({ id: 'j1', status: 'READY', draft_items: [] })
      })
    const p = scanPriceList(new Blob(['x']), 'l.jpg', undefined, (id) => seen.push(`created:${id}`))
    await vi.advanceTimersByTimeAsync(3000)
    await p
    expect(seen).toEqual(['created:j1', 'poll'])
  })

  it('a FAILED job rejects with the server code, not raw text', async () => {
    client.apiClient.mockResolvedValueOnce(env({ id: 'j1', status: 'FAILED', error_code: 'COULD_NOT_READ_IMAGE', error: 'x' }))
    await expect(scanPriceList(new Blob(['x']), 'l.jpg')).rejects.toMatchObject({ code: 'COULD_NOT_READ_IMAGE' })
  })

  it('gives up after the documented ~100 s', async () => {
    client.apiClient.mockResolvedValue(env({ id: 'j1', status: 'PROCESSING' }))
    const p = scanPriceList(new Blob(['x']), 'l.jpg')
    const assertion = expect(p).rejects.toMatchObject({ code: 'TIMEOUT' })
    await vi.advanceTimersByTimeAsync(SCAN_TIMEOUT_MS + 5000)
    await assertion
    expect(SCAN_TIMEOUT_MS).toBe(100_000)
  })

  it('HTTP errors keep the backend error code', async () => {
    const err = Object.assign(new Error('limit'), { status: 429, data: { code: 'DAILY_LIMIT_REACHED', message: 'limit' } })
    client.apiClient.mockRejectedValueOnce(err)
    await expect(scanPriceList(new Blob(['x']), 'l.jpg')).rejects.toMatchObject({ code: 'DAILY_LIMIT_REACHED' })
  })
})

describe('confirmImport', () => {
  it('posts owner rows + currency confirmation as JSON', async () => {
    client.apiClient.mockResolvedValueOnce(env({ created: [], updated: [], skipped: [], already_confirmed: false }))
    await confirmImport('j1', [{ action: 'IGNORE', draft_id: 'd1' }], true)
    const [url, opts] = client.apiClient.mock.calls[0]
    expect(url).toBe('/laundries/dashboard/price-imports/j1/confirm/')
    expect(JSON.parse(opts.body)).toEqual({ items: [{ action: 'IGNORE', draft_id: 'd1' }], currency_confirmed: true })
  })

  it('maps rejection to a ScanError', async () => {
    client.apiClient.mockRejectedValueOnce(Object.assign(new Error('x'), { status: 400, data: { code: 'VALIDATION_FAILED' } }))
    await expect(confirmImport('j1', [], false)).rejects.toBeInstanceOf(ScanError)
  })
})
