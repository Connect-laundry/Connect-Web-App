import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  buildLaundryFormData,
  createLaundry,
  formatSubmitError,
  savePriceItems,
  saveWeightPricing,
} from '../api'
import {
  buildSteps,
  defaultHours,
  stepFieldsById,
  usesItemPricing,
  usesWeightPricing,
  type StepId,
} from '../config'
import { formDefaults, setupSchema, type SetupFormValues } from '../schema'
import {
  emptyWeightTier,
  type DayHours,
  type ExpressByService,
  type PriceItem,
  type WeightTier,
} from '../types'
import { validateExpress, validateHours, validatePriceList, validateWeightTiers } from '../validation'

export function useOnboardingWizard() {
  const router = useRouter()
  const { refreshLaundry } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hours, setHours] = useState<DayHours[]>(defaultHours)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [priceItems, setPriceItems] = useState<PriceItem[]>([])
  const [weightTiers, setWeightTiers] = useState<WeightTier[]>([emptyWeightTier()])
  const [express, setExpress] = useState<ExpressByService>({})
  const laundryCreatedRef = useRef(false)
  const createdItemsRef = useRef<Set<string>>(new Set())

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    mode: 'onChange',
    defaultValues: formDefaults,
  })
  const pricingModel = form.watch('pricing_model')
  const showPriceList = usesItemPricing(pricingModel)
  const steps = useMemo(() => buildSteps(showPriceList), [showPriceList])
  const currentStepId = steps[currentStep]?.id
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    if (currentStep > steps.length - 1) setCurrentStep(steps.length - 1)
  }, [steps.length, currentStep])

  const updateDay = (day: number, patch: Partial<DayHours>) =>
    setHours((previous) => previous.map((item) => (item.day === day ? { ...item, ...patch } : item)))

  const goToStep = (id: StepId) => setCurrentStep(steps.findIndex((step) => step.id === id))

  const validateLocalStep = (stepId: StepId | undefined): boolean => {
    let message: string | null = null
    if (stepId === 'hours') message = validateHours(hours)
    if (stepId === 'pricing') message = validateWeightTiers(weightTiers) || validateExpress(express)
    if (stepId === 'pricelist') message = (showPriceList ? validatePriceList(priceItems) : null) || validateExpress(express)
    setError(message)
    return message === null
  }

  const nextStep = async () => {
    if (!validateLocalStep(currentStepId)) return
    const fields = currentStepId ? stepFieldsById[currentStepId] : undefined
    if (!fields || (await form.trigger(fields))) {
      setError(null)
      setCurrentStep((previous) => previous + 1)
    }
  }

  const previousStep = () => {
    setError(null)
    setCurrentStep((previous) => previous - 1)
  }

  const validateSubmission = () => {
    const checks: Array<[StepId, string | null]> = [
      ['hours', validateHours(hours)],
      ['pricing', usesWeightPricing(pricingModel) ? validateWeightTiers(weightTiers) : null],
      ['pricelist', showPriceList ? validatePriceList(priceItems) : null],
      [showPriceList ? 'pricelist' : 'pricing', validateExpress(express)],
    ]
    const failed = checks.find(([, message]) => message)
    if (!failed) return true
    setError(failed[1])
    goToStep(failed[0])
    return false
  }

  const submit = async (values: SetupFormValues) => {
    if (!isLastStep) return nextStep()
    if (!validateSubmission()) return

    setIsLoading(true)
    setError(null)
    try {
      if (!laundryCreatedRef.current) {
        await createLaundry(buildLaundryFormData(values, hours, selectedFile))
        laundryCreatedRef.current = true
      }
      if (usesWeightPricing(values.pricing_model)) await saveWeightPricing(values, weightTiers)
      if (showPriceList) await savePriceItems(priceItems, createdItemsRef.current)
      await refreshLaundry()
      router.push('/onboarding/pending')
    } catch (error: unknown) {
      console.warn('[onboarding] submit failed', error)
      setError(formatSubmitError(error, laundryCreatedRef.current))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    steps,
    currentStep,
    currentStepId,
    isLastStep,
    isLoading,
    error,
    hours,
    updateDay,
    selectedFile,
    setSelectedFile,
    priceItems,
    setPriceItems,
    weightTiers,
    setWeightTiers,
    express,
    setExpress,
    isHybrid: pricingModel === 'HYBRID',
    nextStep,
    previousStep,
    submit,
  }
}
