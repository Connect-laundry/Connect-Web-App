import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { OnboardingStatusBanner } from '@/features/onboarding/components/OnboardingStatusBanner'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-background/50">
          <div className="px-6 md:px-8 lg:px-10 pt-6 max-w-[1400px] mx-auto">
            <OnboardingStatusBanner />
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
