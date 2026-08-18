import { Suspense } from 'react'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { Spinner } from '@/shared/ui/spinner'

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

export default ResetPasswordPage
