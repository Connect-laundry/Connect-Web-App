import { useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { SetupFormValues } from '../schema'
import type { DayHours, ExpressByService, PriceItem, WeightTier } from '../types'

const STORAGE_KEY = 'connect_onboarding_draft'

export interface OnboardingDraftState {
  currentStep: number
  formValues: SetupFormValues
  hours: DayHours[]
  priceItems: PriceItem[]
  weightTiers: WeightTier[]
  express: ExpressByService
}

interface UseOnboardingStorageProps {
  form: UseFormReturn<SetupFormValues>
  currentStep: number
  setCurrentStep: (step: number) => void
  hours: DayHours[]
  setHours: (hours: DayHours[]) => void
  priceItems: PriceItem[]
  setPriceItems: (items: PriceItem[]) => void
  weightTiers: WeightTier[]
  setWeightTiers: (tiers: WeightTier[]) => void
  express: ExpressByService
  setExpress: (express: ExpressByService) => void
}

export function useOnboardingStorage({
  form,
  currentStep,
  setCurrentStep,
  hours,
  setHours,
  priceItems,
  setPriceItems,
  weightTiers,
  setWeightTiers,
  express,
  setExpress,
}: UseOnboardingStorageProps) {
  const isHydrated = useRef(false)

  // Hydrate on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as OnboardingDraftState
        if (parsed.formValues) form.reset(parsed.formValues)
        if (parsed.currentStep !== undefined) setCurrentStep(parsed.currentStep)
        if (parsed.hours) setHours(parsed.hours)
        if (parsed.priceItems) setPriceItems(parsed.priceItems)
        if (parsed.weightTiers) setWeightTiers(parsed.weightTiers)
        if (parsed.express) setExpress(parsed.express)
      }
    } catch (error) {
      console.warn('Failed to parse onboarding draft', error)
    } finally {
      isHydrated.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save changes automatically after hydration
  useEffect(() => {
    if (!isHydrated.current) return

    const subscription = form.watch((value) => {
      saveDraft(value as SetupFormValues)
    })

    saveDraft(form.getValues())

    return () => subscription.unsubscribe()
  }, [form, currentStep, hours, priceItems, weightTiers, express])

  const saveDraft = (formValues?: SetupFormValues) => {
    try {
      const stateToSave: OnboardingDraftState = {
        currentStep,
        formValues: formValues || form.getValues(),
        hours,
        priceItems,
        weightTiers,
        express,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (error) {
      console.warn('Failed to save onboarding draft', error)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { saveDraft, clearDraft }
}
