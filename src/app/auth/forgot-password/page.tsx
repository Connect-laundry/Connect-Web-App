import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
