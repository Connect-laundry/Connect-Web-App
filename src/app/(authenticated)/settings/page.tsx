'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useAuth } from '@/features/auth/context/AuthContext'
import { updateProfile } from '@/features/auth/api'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { PageShell } from '@/shared/components/layout/PageShell'
import { PageHeader } from '@/shared/components/layout/PageHeader'

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function SettingsPage() {
  const { user, login, hydrate } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      })
    }
  }, [user, form])

  async function onSubmit(values: ProfileFormValues) {
    setIsSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const updated = await updateProfile(values)
      login(updated)
      await hydrate()
      setSuccess('Profile updated successfully')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageShell contentClassName="max-w-2xl">
      <PageHeader title="Settings" description="Update your owner account details." />

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <Card className="surface-card border-0">
            <CardHeader>
              <CardTitle className="font-black">Account information</CardTitle>
              <CardDescription>Update your name and phone number</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <p className="text-sm text-muted-foreground mb-4">
                Email: <span className="font-medium text-foreground">{user?.email}</span>
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSaving} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSaving} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSaving} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSaving} className="shadow-glow-sm font-bold">
                    {isSaving ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
