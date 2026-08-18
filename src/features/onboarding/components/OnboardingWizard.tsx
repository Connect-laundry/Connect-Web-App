'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form } from '@/shared/ui/form'
import { useOnboardingWizard } from '../hooks/useOnboardingWizard'
import { OnboardingStepper } from './OnboardingStepper'
import { BusinessInfoStep } from './steps/BusinessInfoStep'
import { LocationStep } from './steps/LocationStep'
import { PriceListStep } from './steps/PriceListStep'
import { PricingDeliveryStep } from './steps/PricingDeliveryStep'
import { ReviewStep } from './steps/ReviewStep'
import { WorkingHoursStep } from './steps/WorkingHoursStep'

export const OnboardingWizard = () => {
  const wizard = useOnboardingWizard()

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <OnboardingStepper steps={wizard.steps} currentStep={wizard.currentStep} />
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle>{wizard.steps[wizard.currentStep]?.title}</CardTitle>
          <CardDescription>{wizard.steps[wizard.currentStep]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...wizard.form}>
            <form onSubmit={wizard.form.handleSubmit(wizard.submit)} className="space-y-6">
              {wizard.error && <Alert variant="destructive"><AlertDescription>{wizard.error}</AlertDescription></Alert>}
              <AnimatePresence mode="wait">
                <motion.div key={wizard.currentStepId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  {wizard.currentStepId === 'business' && <BusinessInfoStep selectedFile={wizard.selectedFile} setSelectedFile={wizard.setSelectedFile} />}
                  {wizard.currentStepId === 'location' && <LocationStep />}
                  {wizard.currentStepId === 'hours' && <WorkingHoursStep hours={wizard.hours} updateDay={wizard.updateDay} />}
                  {wizard.currentStepId === 'pricing' && <PricingDeliveryStep weightTiers={wizard.weightTiers} setWeightTiers={wizard.setWeightTiers} express={wizard.express} setExpress={wizard.setExpress} />}
                  {wizard.currentStepId === 'pricelist' && <PriceListStep items={wizard.priceItems} setItems={wizard.setPriceItems} express={wizard.express} setExpress={wizard.setExpress} isHybrid={wizard.isHybrid} />}
                  {wizard.currentStepId === 'review' && <ReviewStep hours={wizard.hours} priceItems={wizard.priceItems} weightTiers={wizard.weightTiers} express={wizard.express} />}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between pt-6 border-t mt-8">
                <Button type="button" variant="outline" onClick={wizard.previousStep} disabled={wizard.currentStep === 0 || wizard.isLoading}><ChevronLeft className="w-4 h-4 mr-2" />Back</Button>
                {!wizard.isLastStep ? (
                  <Button type="button" onClick={wizard.nextStep}>Next<ChevronRight className="w-4 h-4 ml-2" /></Button>
                ) : (
                  <Button type="submit" disabled={wizard.isLoading}>{wizard.isLoading ? 'Creating Profile...' : 'Complete Registration'}<Check className="w-4 h-4 ml-2" /></Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
