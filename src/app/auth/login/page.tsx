import { Suspense } from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Spinner } from '@/shared/ui/spinner'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 mesh-bg" aria-hidden />
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-primary/25 blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="mb-10 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-1">
            <SimameLogo variant="brand" className="animate-bounce-subtle mx-auto" />
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.25em]">
              Owner dashboard
            </p>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
        
        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <a 
            href="/auth/diagnostics" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all hover:-translate-y-px active:translate-y-0"
          >
            Having connection issues? <span className="underline decoration-primary/30 underline-offset-4">Run diagnostics</span>
          </a>
        </div>
      </div>
    </div>
  )
}
