import { Check } from 'lucide-react'
import type { StepMeta } from '../config'

interface OnboardingStepperProps {
  steps: StepMeta[]
  currentStep: number
}

/** Horizontal progress indicator for the onboarding wizard. */
export const OnboardingStepper = ({ steps, currentStep }: OnboardingStepperProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Phones: compact circles, no labels (the card title names the step). */}
      {steps.map((step, idx) => {
        const Icon = step.icon
        const reached = idx <= currentStep
        return (
          <div key={step.id} className="flex min-w-0 flex-col items-center flex-1 relative">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                reached
                  ? 'bg-primary border-primary text-white'
                  : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {idx < currentStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <span
              className={`hidden sm:block text-xs mt-2 font-medium text-center ${
                reached ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`absolute top-4 sm:top-5 left-[60%] w-[80%] h-[2px] -z-10 bg-muted ${
                  idx < currentStep ? 'bg-primary' : ''
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
