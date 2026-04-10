import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { searchAddresses, reverseGeocode, type AddressSuggestion } from '../api'

export type LocationMode = 'gps' | 'search'

const SEARCH_DEBOUNCE_MS = 350
const MIN_QUERY_LENGTH = 3

/**
 * Encapsulates business-location capture for onboarding: browser GPS and
 * type-ahead address search (with a suggestions dropdown). Writes the resolved
 * coordinates into the form's read-only `latitude` / `longitude` fields.
 */
export function useLocationCapture() {
  const form = useFormContext()
  const [mode, setMode] = useState<LocationMode>('gps')
  const [addressSearch, setAddressSearch] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [detected, setDetected] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setCoords = (lat: string, lng: string) => {
    form.setValue('latitude', lat, { shouldValidate: true })
    form.setValue('longitude', lng, { shouldValidate: true })
  }

  const clearCoords = () => {
    form.setValue('latitude', '')
    form.setValue('longitude', '')
  }

  const switchMode = (next: LocationMode) => {
    setMode(next)
    setError(null)
    setDetected(false)
    setSuggestions([])
    clearCoords()
  }

  const reset = (clearSearch = false) => {
    setDetected(false)
    setSuggestions([])
    clearCoords()
    if (clearSearch) setAddressSearch('')
  }

  const detectLocation = () => {
    setError(null)
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser. Use address search or enter your address below.')
      setMode('search')
      return
    }
    
    setIsLocating(true)

    const handleSuccess = async (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords
      setCoords(latitude.toFixed(6), longitude.toFixed(6))
      setDetected(true)
      setIsLocating(false)
      setError(null)
      try {
        const place = await reverseGeocode(latitude, longitude)
        if (place) {
          if (place.formatted_address && !form.getValues('address')) {
            form.setValue('address', place.formatted_address, { shouldValidate: true })
          }
          if (place.city && !form.getValues('city')) {
            form.setValue('city', place.city, { shouldValidate: true })
          }
        }
      } catch {
        /* reverse lookup is best-effort; coordinates are already set */
      }
    }

    const handleError = (err: GeolocationPositionError) => {
      // If high accuracy times out, try standard accuracy fallback
      if (err.code === err.TIMEOUT) {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          (_fallbackErr) => {
            setIsLocating(false)
            setError('Location request timed out. Please select your location via address search.')
          },
          { enableHighAccuracy: false, timeout: 8000 }
        )
        return
      }

      setIsLocating(false)
      setError(
        err.code === err.PERMISSION_DENIED
          ? 'Location permission was denied. Please use the search bar or enter your shop address.'
          : 'Could not detect your GPS location. Please use address search.'
      )
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  }

  const runSearch = async (query: string) => {
    setIsSearching(true)
    setError(null)
    try {
      setSuggestions(await searchAddresses(query))
    } catch (err: any) {
      console.warn('[geocode] search failed', err)
      setSuggestions([])
      setError(err?.message || 'Could not search addresses. Check your connection and try again.')
    } finally {
      setIsSearching(false)
    }
  }

  // Geocode address typed directly in street address / city fields
  const locateFromFormAddress = async () => {
    const address = form.getValues('address') || ''
    const city = form.getValues('city') || ''
    const fullQuery = [address, city].filter(Boolean).join(', ')

    if (!fullQuery || fullQuery.length < 3) {
      setError('Please type your street address and city first.')
      return
    }

    setIsSearching(true)
    setError(null)
    try {
      const matches = await searchAddresses(fullQuery, 5)
      if (matches.length > 0) {
        selectSuggestion(matches[0])
      } else {
        setError(`No coordinates found for "${fullQuery}". Try picking a landmark in search mode.`)
      }
    } catch (err: any) {
      setError(err?.message || 'Address lookup failed.')
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced as the owner types; clears coordinates so a stale pin can't linger.
  const onSearchChange = (value: string) => {
    setAddressSearch(value)
    setError(null)
    setDetected(false)
    clearCoords()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const query = value.trim()
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS)
  }

  const selectSuggestion = (s: AddressSuggestion) => {
    setCoords(s.latitude.toFixed(6), s.longitude.toFixed(6))
    setDetected(true)
    setSuggestions([])
    setAddressSearch(s.formatted_address)
    if (s.formatted_address && !form.getValues('address')) {
      form.setValue('address', s.formatted_address, { shouldValidate: true })
    }
    if (s.city && !form.getValues('city')) {
      form.setValue('city', s.city, { shouldValidate: true })
    }
  }

  return {
    mode,
    switchMode,
    addressSearch,
    onSearchChange,
    suggestions,
    selectSuggestion,
    error,
    isLocating,
    isSearching,
    detected,
    detectLocation,
    locateFromFormAddress,
    reset,
  }
}
