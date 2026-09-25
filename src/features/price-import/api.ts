/**
 * Price-list import API. The browser only ever talks to the Simame backend
 * (through the /api/proxy BFF); it never calls Gemini, OCR.space or any AI
 * service directly and never holds an AI key.
 */
import { apiClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import type { ConfirmResult, ConfirmRow, ImportAvailability, ImportJob } from './types'

const BASE = '/laundries/dashboard/price-imports'

/** Total time we wait for a scan, matching the backend contract (~100 s). */
export const SCAN_TIMEOUT_MS = 100_000
const POLL_INTERVAL_MS = 2_000
const UPLOAD_TIMEOUT_MS = 60_000

export class ScanError extends Error {
  constructor(public code: string, message: string) {
    super(message)
  }
}

type ApiError = Error & { status?: number; data?: { code?: string; message?: string } }

const withTimeout = async <T>(ms: number, outer: AbortSignal | undefined, run: (signal: AbortSignal) => Promise<T>) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  const onOuterAbort = () => controller.abort()
  outer?.addEventListener('abort', onOuterAbort)
  try {
    return await run(controller.signal)
  } catch (error) {
    if (controller.signal.aborted) throw new ScanError(outer?.aborted ? 'CANCELLED' : 'TIMEOUT', 'timeout')
    throw toScanError(error)
  } finally {
    clearTimeout(timer)
    outer?.removeEventListener('abort', onOuterAbort)
  }
}

export function toScanError(error: unknown): ScanError {
  if (error instanceof ScanError) return error
  const apiError = error as ApiError
  const code = apiError?.data?.code || (apiError?.status ? `HTTP_${apiError.status}` : 'NETWORK')
  return new ScanError(code, apiError?.data?.message || apiError?.message || '')
}

export async function getScanAvailability(): Promise<ImportAvailability> {
  return unwrap<ImportAvailability>(await apiClient(`${BASE}/availability/`, { method: 'GET' }))
}

export async function getImportJob(jobId: string, signal?: AbortSignal): Promise<ImportJob> {
  return withTimeout(15_000, signal, async (inner) =>
    unwrap<ImportJob>(await apiClient(`${BASE}/${jobId}/`, { method: 'GET', signal: inner })),
  )
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new ScanError('CANCELLED', 'cancelled'))
    })
  })

/**
 * Upload with `?async=1` (the server answers at once with 202 and reads the
 * list in the background) and poll until the job finishes, up to
 * SCAN_TIMEOUT_MS. Resolves with a READY job; FAILED jobs reject with the
 * backend's owner-safe error code.
 */
export async function scanPriceList(
  image: Blob,
  filename: string,
  signal?: AbortSignal,
  /** Called as soon as the job exists, so a page reload can resume it. */
  onCreated?: (jobId: string) => void,
): Promise<ImportJob> {
  const started = Date.now()
  const form = new FormData()
  form.append('source_image', image, filename)
  const job = await withTimeout(UPLOAD_TIMEOUT_MS, signal, async (inner) =>
    unwrap<ImportJob>(await apiClient(`${BASE}/?async=1`, { method: 'POST', body: form, signal: inner })),
  )
  onCreated?.(job.id)
  return waitForJob(job, signal, started)
}

/** Polls a job until it is ready for review; throws a ScanError otherwise. */
export async function waitForJob(initial: ImportJob, signal?: AbortSignal, started = Date.now()): Promise<ImportJob> {
  let job = initial
  while (job.status === 'PROCESSING' || job.status === 'PENDING') {
    if (Date.now() - started > SCAN_TIMEOUT_MS) throw new ScanError('TIMEOUT', 'timeout')
    await sleep(POLL_INTERVAL_MS, signal)
    job = await getImportJob(job.id, signal)
  }
  if (job.status === 'FAILED') throw new ScanError(job.error_code || 'FAILED', job.error)
  if (job.status !== 'READY' && job.status !== 'CONFIRMED') throw new ScanError('NOT_READY', '')
  return job
}

export async function confirmImport(
  jobId: string,
  items: ConfirmRow[],
  currencyConfirmed: boolean,
): Promise<ConfirmResult> {
  try {
    return unwrap<ConfirmResult>(
      await apiClient(`${BASE}/${jobId}/confirm/`, {
        method: 'POST',
        body: JSON.stringify({ items, currency_confirmed: currencyConfirmed }),
      }),
    )
  } catch (error) {
    throw toScanError(error)
  }
}

export async function cancelImport(jobId: string): Promise<void> {
  try {
    await apiClient(`${BASE}/${jobId}/cancel/`, { method: 'POST' })
  } catch {
    // Cancelling is housekeeping; never block the owner on it.
  }
}
