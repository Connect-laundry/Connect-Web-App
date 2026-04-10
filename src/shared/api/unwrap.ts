/** Unwrap the backend's `{ status, message, data }` envelope, if present. */
export function unwrap<T = unknown>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data: T }).data
  }
  return response as T
}

/** Pull a list out of a bare array, paginated `{ results }`, or enveloped response. */
export function unwrapList<T = unknown>(response: unknown): T[] {
  const data = unwrap<unknown>(response)
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: T[] }).results)) {
    return (data as { results: T[] }).results
  }
  return []
}

/** Normalize list endpoints into `{ count, next?, previous?, results }`. */
export function unwrapPaginated<T = unknown>(response: unknown): {
  count: number
  next?: string | null
  previous?: string | null
  results: T[]
} {
  const data = unwrap<unknown>(response)

  if (data && typeof data === 'object' && Array.isArray((data as { results?: T[] }).results)) {
    const page = data as { count?: number; next?: string | null; previous?: string | null; results: T[] }
    return {
      count: page.count ?? page.results.length,
      next: page.next,
      previous: page.previous,
      results: page.results,
    }
  }

  if (Array.isArray(data)) {
    return { count: data.length, results: data as T[] }
  }

  return { count: 0, results: [] }
}
