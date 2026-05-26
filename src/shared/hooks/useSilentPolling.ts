import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Run fetch on mount + optional interval. First load can show a spinner;
 * later polls refresh in the background without blocking the UI.
 */
export function useSilentPolling(
  fetcher: () => Promise<void>,
  intervalMs?: number,
) {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(async (silent: boolean) => {
    if (silent) {
      setIsRefreshing(true)
    } else {
      setIsInitialLoading(true)
    }
    try {
      await fetcherRef.current()
    } finally {
      if (silent) {
        setIsRefreshing(false)
      } else {
        setIsInitialLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void run(false)
    if (!intervalMs || intervalMs <= 0) return

    const id = setInterval(() => void run(true), intervalMs)
    return () => clearInterval(id)
  }, [run, intervalMs])

  return { isInitialLoading, isRefreshing }
}
