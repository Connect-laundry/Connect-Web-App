'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { UserX, ShieldAlert, Trash2, Smartphone, FileCheck } from 'lucide-react'
import { AccountDeletionForm } from './AccountDeletionForm'
import { PERMANENTLY_DELETED_ITEMS, RETAINED_DATA_ITEMS } from '../constants'

export const AccountDeletionContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 1. App Store Disclosure Notice */}
      <Card className="surface-card border-0 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border border-destructive/20">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <UserX className="h-7 w-7" />
            <h2 className="text-2xl font-black m-0 text-foreground">SIMAME Account & Data Deletion Request</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            In compliance with the <strong className="text-foreground">Google Play Store Policy</strong> and <strong className="text-foreground">Apple App Store Guidelines</strong>, SIMAME provides users with the full right to delete their account and associated personal data at any time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-background/80 p-4 rounded-xl border border-border/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Smartphone className="h-5 w-5 text-primary" />
                <span>Method 1: In-App Self-Service</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Log into the SIMAME Mobile App → Navigate to <strong>Settings</strong> → <strong>Account & Security</strong> → Tap <strong>&quot;Delete Account&quot;</strong> to trigger immediate deletion.
              </p>
            </div>

            <div className="bg-background/80 p-4 rounded-xl border border-border/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <FileCheck className="h-5 w-5 text-primary" />
                <span>Method 2: Web Request Form</span>
              </div>
              <p className="text-sm text-muted-foreground">
                If you no longer have the app installed or cannot log in, submit the web deletion request form below to initiate account purging.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. What Happens When You Delete Your Account */}
      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShieldAlert className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">Data Retention & Deletion Scope</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            When your account deletion request is processed:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-destructive flex items-center gap-2 m-0">
                <Trash2 className="h-4 w-4" /> Data Permanently Deleted:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                {PERMANENTLY_DELETED_ITEMS.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 m-0">
                <ShieldAlert className="h-4 w-4 text-amber-500" /> Data Retained for Legal Compliance:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                {RETAINED_DATA_ITEMS.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Interactive Web Request Form */}
      <Card className="surface-card border-0 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <CardTitle className="text-xl font-bold">Submit Account Deletion Request</CardTitle>
          <CardDescription>
            Complete this form to request permanent account deletion. Requests are processed within 24-48 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <AccountDeletionForm />
        </CardContent>
      </Card>
    </div>
  )
}
