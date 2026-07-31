'use client'

import { useEffect, useState, useMemo } from 'react'
import { Laundry, PricingItem, WeightPricing } from '@/shared/interfaces'
import {
  getLaundryProfile,
  getPricingItems,
  getWeightPricing,
  toggleVacationMode,
} from '@/features/business/api'

export function useBusinessProfile() {
  const [laundry, setLaundry] = useState<Laundry | null>(null)
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([])
  const [weightPricing, setWeightPricing] = useState<WeightPricing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTogglingVacation, setIsTogglingVacation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setIsLoading(true)
        const [profile, items, weight] = await Promise.all([
          getLaundryProfile(),
          getPricingItems(),
          getWeightPricing(),
        ])
        if (cancelled) return
        if (!profile) {
          setError('Could not load your business profile. Please try again.')
        }
        setLaundry(profile)
        setPricingItems(items)
        setWeightPricing(weight)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load business details')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const onVacationToggle = async () => {
    setIsTogglingVacation(true)
    setError(null)
    try {
      const vacation_mode = await toggleVacationMode()
      setLaundry((prev) => (prev ? { ...prev, vacation_mode } : prev))
    } catch (err: any) {
      setError(err?.message || 'Failed to toggle vacation mode.')
    } finally {
      setIsTogglingVacation(false)
    }
  }

  const usesItems = useMemo(
    () => laundry?.pricing_model === 'BY_ITEM' || laundry?.pricing_model === 'HYBRID',
    [laundry?.pricing_model]
  )

  const usesWeight = useMemo(
    () => laundry?.pricing_model === 'BY_WEIGHT' || laundry?.pricing_model === 'HYBRID',
    [laundry?.pricing_model]
  )

  return {
    laundry,
    setLaundry,
    pricingItems,
    setPricingItems,
    weightPricing,
    setWeightPricing,
    isLoading,
    isTogglingVacation,
    error,
    onVacationToggle,
    usesItems,
    usesWeight,
    getPricingItems,
  }
}
