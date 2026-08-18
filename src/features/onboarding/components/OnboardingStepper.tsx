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
      {steps.map((step, idx) => {
        const Icon = step.icon
        const reached = idx <= currentStep
        return (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                reached
                  ? 'bg-primary border-primary text-white'
                  : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {idx < currentStep ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span
              className={`text-xs mt-2 font-medium text-center ${
                reached ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`absolute top-5 left-[60%] w-[80%] h-[2px] -z-10 bg-muted ${
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
