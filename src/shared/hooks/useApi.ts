import { useEffect, useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook for fetching data with loading and error states
 */
export function useApi<T = any>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options?: {
    refetchInterval?: number
    onError?: (error: Error) => void
  }
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const data = await fetchFn()
      setState({ data, isLoading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, isLoading: false, error: err })
      options?.onError?.(err)
    }
  }, [fetchFn, options])

  useEffect(() => {
    refetch()

    // Set up refetch interval if specified
    let interval: NodeJS.Timeout | null = null
    if (options?.refetchInterval) {
      interval = setInterval(refetch, options.refetchInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refetch,
  }
}
