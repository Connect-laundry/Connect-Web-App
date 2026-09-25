import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cancelImport, getImportJob, getScanAvailability, scanPriceList, toScanError, waitForJob } from '../api'
import { ACCEPTED_TYPES, prepareUpload } from '../lib/image'
import { scanErrorText } from '../lib/messages'
import {
  DEFAULT_SERVICE,
  buildReviewRows,
  matchExisting,
  reviewProblems,
  rowProblem,
  type ReviewContext,
  type ReviewRow,
} from '../lib/review'
import type { ImportJob, ServiceType } from '../types'

export type ScanPhase = 'idle' | 'preview' | 'reading' | 'review'

/** Progressive, provider-free status copy while the list is being read. */
export function readingMessage(elapsedMs: number): string {
  if (elapsedMs < 8_000) return 'Reading your price list…'
  if (elapsedMs < 30_000) return 'Finding services and prices…'
  return 'Almost there. Longer lists can take up to a minute.'
}

// The scan in progress survives a reload (per tab). The server still owns the
// job and its ownership check; this only remembers which one to reopen.
const STORAGE_PREFIX = 'simame_price_scan:'
function rememberJob(scope: string | undefined, jobId: string | null) {
  if (!scope) return
  try {
    if (jobId) sessionStorage.setItem(STORAGE_PREFIX + scope, jobId)
    else sessionStorage.removeItem(STORAGE_PREFIX + scope)
  } catch {
    // Storage blocked: resuming is a convenience only.
  }
}
function rememberedJob(scope: string | undefined): string | null {
  if (!scope) return null
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + scope)
  } catch {
    return null
  }
}

export function usePriceListScan(
  ctx: ReviewContext,
  initialService: ServiceType = DEFAULT_SERVICE,
  /** Where the scan lives ('onboarding', 'dashboard'); enables resume after reload. */
  scope?: string,
) {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [job, setJob] = useState<ImportJob | null>(null)
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [defaultService, setDefaultServiceState] = useState<ServiceType>(initialService)
  const [currencyConfirmed, setCurrencyConfirmed] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const scopeRef = useRef(scope)
  scopeRef.current = scope
  const defaultServiceRef = useRef(defaultService)
  defaultServiceRef.current = defaultService

  const showJob = useCallback((result: ImportJob) => {
    const built = matchExisting(buildReviewRows(result.draft_items, ctxRef.current), ctxRef.current, defaultServiceRef.current)
    setJob(result)
    setRows(built)
    setPhase('review')
  }, [])

  useEffect(() => {
    let alive = true
    getScanAvailability()
      .then((a) => {
        if (!alive) return
        setAvailable(a.available)
        const resumeId = a.available ? rememberedJob(scopeRef.current) : null
        if (resumeId) void resume(resumeId)
      })
      .catch(() => alive && setAvailable(false))

    // Reopen a scan from before a reload: still reading → keep waiting,
    // ready → show the review again. Anything else is finished; forget it.
    async function resume(jobId: string) {
      const controller = new AbortController()
      abortRef.current = controller
      setPhase('reading')
      try {
        const current = await getImportJob(jobId, controller.signal)
        if (!['READY', 'PROCESSING', 'PENDING'].includes(current.status)) throw new Error('finished')
        const result = await waitForJob(current, controller.signal)
        if (!alive) return
        if (result.status !== 'READY') throw new Error('finished')
        showJob(result)
      } catch (e) {
        if (!alive || toScanError(e).code === 'CANCELLED') return
        rememberJob(scopeRef.current, null)
        setPhase('idle')
      }
    }

    return () => {
      alive = false
      abortRef.current?.abort()
    }
  }, [showJob])

  // Unsaved review edits: ask before the tab closes or reloads.
  useEffect(() => {
    if (phase !== 'review' || rows.length === 0) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [phase, rows.length])

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  // Follow the service tab the owner is on until review starts; during
  // review the owner's explicit choice in the panel wins.
  useEffect(() => {
    if (phase !== 'review') setDefaultServiceState(initialService)
  }, [initialService, phase])

  useEffect(() => {
    if (phase !== 'reading') return
    const started = Date.now()
    const t = setInterval(() => setElapsed(Date.now() - started), 1000)
    return () => clearInterval(t)
  }, [phase])

  const pickFile = useCallback((picked: File | null) => {
    if (!picked) return
    setError(null)
    if (picked.type && !picked.type.startsWith('image/')) {
      setError('Please choose a photo (JPEG, PNG or WebP).')
      return
    }
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
    setPhase('preview')
  }, [])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    rememberJob(scopeRef.current, null)
    if (job && job.status === 'READY') void cancelImport(job.id)
    setFile(null)
    setPreviewUrl(null)
    setJob(null)
    setRows([])
    setError(null)
    setCurrencyConfirmed(false)
    setPhase('idle')
  }, [job])

  const read = useCallback(async () => {
    if (!file) return
    setError(null)
    setElapsed(0)
    setPhase('reading')
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const upload = await prepareUpload(file)
      const result = await scanPriceList(upload.blob, upload.filename, controller.signal, (id) => rememberJob(scopeRef.current, id))
      showJob(result)
    } catch (e) {
      const err = toScanError(e)
      if (err.code === 'CANCELLED') return
      rememberJob(scopeRef.current, null)
      setError(scanErrorText(err.code, err.message))
      setPhase('preview')
    }
  }, [file, showJob])

  const cancelReading = useCallback(() => {
    abortRef.current?.abort()
    rememberJob(scopeRef.current, null)
    setPhase(file ? 'preview' : 'idle')
  }, [file])

  const updateRow = useCallback((key: string, patch: Partial<ReviewRow>) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.key === key ? { ...r, ...patch } : r))
      // Service or name changes can change which existing value a row matches.
      return 'service' in patch || 'name' in patch ? matchExisting(next, ctxRef.current, defaultService) : next
    })
  }, [defaultService])

  const setDefaultService = useCallback((service: ServiceType) => {
    setDefaultServiceState(service)
    setRows((prev) => matchExisting(prev, ctxRef.current, service))
  }, [])

  const needsCurrency = !!job && (job.currency !== 'GHS' || job.document_warnings.includes('FOREIGN_CURRENCY'))
  const problems = useMemo(() => {
    const list = reviewProblems(rows, defaultService)
    const bad = rows.find((r) => rowProblem(r, defaultService))
    if (bad) list.unshift(`${bad.name || 'A row'}: ${rowProblem(bad, defaultService)}`)
    if (needsCurrency && !currencyConfirmed) list.push('Confirm that these prices are in Ghana cedis.')
    return list
  }, [rows, defaultService, needsCurrency, currencyConfirmed])

  const includedCount = rows.filter((r) => r.include && !(r.existing && r.choice === 'KEEP')).length

  return {
    available,
    accept: ACCEPTED_TYPES.join(','),
    phase,
    file,
    previewUrl,
    error,
    job,
    rows,
    defaultService,
    currencyConfirmed,
    needsCurrency,
    problems,
    includedCount,
    readingText: readingMessage(elapsed),
    pickFile,
    clear,
    read,
    cancelReading,
    updateRow,
    setDefaultService,
    setCurrencyConfirmed,
    setError,
  }
}

export type PriceListScan = ReturnType<typeof usePriceListScan>
