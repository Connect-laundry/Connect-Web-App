'use client'

import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2, Clock, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

export default function PendingPage() {
  const { laundry, refreshLaundry, isLaundryLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (laundry?.status === 'APPROVED') {
      router.push('/dashboard')
    }
  }, [laundry, router])

  const handleRefresh = async () => {
    await refreshLaundry()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
        <Card className="max-w-md w-full text-center glass-morphism border-white/20">
          <CardHeader>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Profile Under Review</CardTitle>
            <CardDescription>
              We're reviewing your business details. This usually takes less than 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground italic">
              "We've received your application for <strong>{laundry?.name || 'your laundry'}</strong>. You'll receive an email notification once your account is active."
            </div>
            
            <Button 
              onClick={handleRefresh} 
              disabled={isLaundryLoading}
              className="w-full"
            >
              {isLaundryLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Questions? Contact our support team at support@connectlaundry.app
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
