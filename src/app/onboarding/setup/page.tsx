import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

const SetupPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen landing-mesh">
        <div className="container mx-auto">
          <OnboardingWizard />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default SetupPage
