import { useEffect, useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook for fetching data with loading and error states
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options?: {
    refetchInterval?: number
    onError?: (_err: Error) => void
  }
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    // Only set loading if not already loading to avoid sync setState warning in useEffect
    setState((prev) => (prev.isLoading ? prev : { ...prev, isLoading: true }))
    try {
      const data = await fetchFn()
      setState({ data, isLoading: false, error: null })
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setState({ data: null, isLoading: false, error: errorObj })
      options?.onError?.(errorObj)
    }
  }, [fetchFn, options])

  useEffect(() => {
    // We don't call refetch() synchronously if we're already in the loading state,
    // but the effect still needs to trigger the fetch. 
    // Since state is initialized with isLoading: true, we just need to start the fetchFn.
    // However, for consistency and to handle dependency changes, we use refetch().
    // We can use a microtask to avoid the "sync setState in effect" warning.
    void Promise.resolve().then(() => {
      refetch()
    })

    // Set up refetch interval if specified
    let interval: NodeJS.Timeout | null = null
    if (options?.refetchInterval) {
      interval = setInterval(refetch, options.refetchInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [refetch, options?.refetchInterval, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refetch,
  }
}
