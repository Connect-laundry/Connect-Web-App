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
  imageDataUrl?: string
  imageFileName?: string
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
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
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
  selectedFile,
  setSelectedFile,
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
        if (parsed.imageDataUrl && parsed.imageFileName) {
          try {
            const restoredFile = dataUrlToFile(parsed.imageDataUrl, parsed.imageFileName)
            setSelectedFile(restoredFile)
          } catch (e) {
            console.warn('Failed to restore image file from draft', e)
          }
        }
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
  }, [form, currentStep, hours, priceItems, weightTiers, express, selectedFile])

  const saveDraft = async (formValues?: SetupFormValues) => {
    try {
      let imageDataUrl: string | undefined
      let imageFileName: string | undefined

      if (selectedFile) {
        try {
          imageDataUrl = await fileToDataUrl(selectedFile)
          imageFileName = selectedFile.name
        } catch (e) {
          console.warn('Failed to encode image file for draft', e)
        }
      }

      const stateToSave: OnboardingDraftState = {
        currentStep,
        formValues: formValues || form.getValues(),
        hours,
        priceItems,
        weightTiers,
        express,
        imageDataUrl,
        imageFileName,
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

