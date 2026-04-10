'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/button'
import { Form } from '@/shared/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'

import { setupSchema, formDefaults, type SetupFormValues } from '../schema'
import {
  buildSteps,
  stepFieldsById,
  defaultHours,
  usesWeightPricing,
  usesItemPricing,
  type StepId,
} from '../config'
import { validateHours, validatePriceList, validateWeightTiers, validateExpress } from '../validation'
import {
  buildLaundryFormData,
  createLaundry,
  saveWeightPricing,
  savePriceItems,
  formatSubmitError,
} from '../api'
import {
  emptyWeightTier,
  type DayHours,
  type ExpressByService,
  type PriceItem,
  type WeightTier,
} from '../types'

import { OnboardingStepper } from './OnboardingStepper'
import { BusinessInfoStep } from './steps/BusinessInfoStep'
import { LocationStep } from './steps/LocationStep'
import { WorkingHoursStep } from './steps/WorkingHoursStep'
import { PricingDeliveryStep } from './steps/PricingDeliveryStep'
import { PriceListStep } from './steps/PriceListStep'
import { ReviewStep } from './steps/ReviewStep'

export function OnboardingWizard() {
  const router = useRouter()
  const { refreshLaundry } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hours, setHours] = useState<DayHours[]>(defaultHours)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // Items live flat with a `category` per row; the Price List step's service
  // tabs create rows pre-tagged with the active category.
  const [priceItems, setPriceItems] = useState<PriceItem[]>([])
  const [weightTiers, setWeightTiers] = useState<WeightTier[]>([emptyWeightTier()])
  // Express is opt-in per service type (or the weight tariff for weight-only).
  const [express, setExpress] = useState<ExpressByService>({})

  // Retry guards: don't re-create the laundry or duplicate already-saved items.
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

  // Keep currentStep in range if the step list shrinks (pricing model change).
  useEffect(() => {
    if (currentStep > steps.length - 1) setCurrentStep(steps.length - 1)
  }, [steps.length, currentStep])

  const updateDay = (day: number, patch: Partial<DayHours>) =>
    setHours((prev) => prev.map((d) => (d.day === day ? { ...d, ...patch } : d)))

  const goToStep = (id: StepId) => setCurrentStep(steps.findIndex((s) => s.id === id))

  // Local-state checks (RHF/zod cover the form fields; these cover the rest).
  const checkHours = () => {
    const msg = validateHours(hours)
    setError(msg)
    return msg === null
  }
  const checkPriceList = () => {
    if (!showPriceList) return true
    const msg = validatePriceList(priceItems)
    setError(msg)
    return msg === null
  }
  const checkWeightTiers = () => {
    if (!usesWeightPricing(pricingModel)) return true
    const msg = validateWeightTiers(weightTiers)
    setError(msg)
    return msg === null
  }
  const checkExpress = () => {
    const msg = validateExpress(express)
    setError(msg)
    return msg === null
  }

  const nextStep = async () => {
    if (currentStepId === 'hours' && !checkHours()) return
    if (currentStepId === 'pricing' && (!checkWeightTiers() || !checkExpress())) return
    if (currentStepId === 'pricelist' && (!checkPriceList() || !checkExpress())) return
    const fields = currentStepId ? stepFieldsById[currentStepId] : undefined
    const isValid = fields ? await form.trigger(fields) : true
    if (isValid) {
      setError(null)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setError(null)
    setCurrentStep((prev) => prev - 1)
  }

  async function onSubmit(values: SetupFormValues) {
    if (!isLastStep) {
      nextStep()
      return
    }

    if (!checkHours()) return goToStep('hours')
    if (!checkWeightTiers()) return goToStep('pricing')
    if (!checkPriceList()) return goToStep('pricelist')
    if (!checkExpress()) return goToStep(showPriceList ? 'pricelist' : 'pricing')

    setIsLoading(true)
    setError(null)
    try {
      // Create the laundry once; follow-up resources require it to exist.
      if (!laundryCreatedRef.current) {
        await createLaundry(buildLaundryFormData(values, hours, selectedFile))
        laundryCreatedRef.current = true
      }
      if (usesWeightPricing(values.pricing_model)) await saveWeightPricing(values, weightTiers)
      if (showPriceList) await savePriceItems(priceItems, createdItemsRef.current)

      await refreshLaundry()
      router.push('/onboarding/pending')
    } catch (err: any) {
      console.warn('[onboarding] submit failed', {
        status: err?.status,
        message: err?.message,
        data: err?.data,
      })
      setError(formatSubmitError(err, laundryCreatedRef.current))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <OnboardingStepper steps={steps} currentStep={currentStep} />

      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle>{steps[currentStep]?.title}</CardTitle>
          <CardDescription>{steps[currentStep]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStepId === 'business' && (
                    <BusinessInfoStep selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                  )}
                  {currentStepId === 'location' && <LocationStep />}
                  {currentStepId === 'hours' && <WorkingHoursStep hours={hours} updateDay={updateDay} />}
                  {currentStepId === 'pricing' && (
                    <PricingDeliveryStep
                      weightTiers={weightTiers}
                      setWeightTiers={setWeightTiers}
                      express={express}
                      setExpress={setExpress}
                    />
                  )}
                  {currentStepId === 'pricelist' && (
                    <PriceListStep
                      items={priceItems}
                      setItems={setPriceItems}
                      express={express}
                      setExpress={setExpress}
                      isHybrid={pricingModel === 'HYBRID'}
                    />
                  )}
                  {currentStepId === 'review' && (
                    <ReviewStep
                      hours={hours}
                      priceItems={priceItems}
                      weightTiers={weightTiers}
                      express={express}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {!isLastStep ? (
                  <Button type="button" onClick={nextStep} key="btn-next">
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} key="btn-submit">
                    {isLoading ? 'Creating Profile...' : 'Complete Registration'}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
