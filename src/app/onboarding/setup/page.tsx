import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

export default function SetupPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50">
        <div className="container mx-auto">
          <OnboardingWizard />
        </div>
      </div>
    </ProtectedRoute>
  )
}
