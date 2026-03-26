import { LoginForm } from '@/features/auth/components/LoginForm'
import { WashingMachine } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="mb-10 text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2 border border-primary/20 shadow-inner">
            <WashingMachine className="w-8 h-8 text-primary animate-bounce-subtle" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Connect Laundry
            </h1>
            <p className="text-muted-foreground font-medium tracking-wide">
              OWNER DASHBOARD
            </p>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          <LoginForm />
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
