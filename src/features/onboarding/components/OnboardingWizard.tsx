'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Switch } from '@/shared/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { useAuth } from '@/features/auth/context/AuthContext'
import { apiPost } from '@/shared/api/client'
import { saveOnboardingApplication } from '@/features/onboarding/lib/storage'
import { Check, ChevronRight, ChevronLeft, Store, MapPin, Clock, Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const setupSchema = z.object({
  name: z.string().min(3, 'Business name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  delivery_fee: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  pickup_fee: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  min_order: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  latitude: z.string(),
  longitude: z.string(),
})

type SetupFormValues = z.infer<typeof setupSchema>

const steps = [
  { id: 'basis', title: 'Business', icon: Store },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'hours', title: 'Hours', icon: Clock },
]

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type DayHours = { day: number; open: string; close: string; is_closed: boolean }

const defaultHours = (): DayHours[] =>
  DAY_LABELS.map((_, i) => ({
    day: i + 1,
    open: '08:00',
    close: '18:00',
    is_closed: i === 6,
  }))

export function OnboardingWizard() {
  const router = useRouter()
  const { refreshLaundry } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [operatingHours, setOperatingHours] = useState<DayHours[]>(defaultHours)

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: '',
      description: '',
      phone_number: '',
      address: '',
      city: '',
      delivery_fee: '15',
      pickup_fee: '10',
      min_order: '50',
      latitude: '5.6037',
      longitude: '-0.1870',
    },
  })

  const nextStep = async () => {
    const fields =
      currentStep === 0
        ? (['name', 'description', 'phone_number'] as const)
        : (['address', 'city', 'delivery_fee', 'pickup_fee', 'min_order'] as const)

    const isValid = await form.trigger(fields)
    if (isValid) {
      setError(null)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setError(null)
    setCurrentStep((prev) => prev - 1)
  }

  async function onSubmit(values: SetupFormValues) {
    setIsLoading(true)
    setError(null)

    const application = {
      ...values,
      operating_hours: operatingHours,
    }

    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('phone_number', values.phone_number)
      formData.append('address', values.address)
      formData.append('city', values.city)
      formData.append('delivery_fee', values.delivery_fee)
      formData.append('pickup_fee', values.pickup_fee)
      formData.append('min_order', values.min_order)
      formData.append('latitude', values.latitude)
      formData.append('longitude', values.longitude)
      formData.append('operating_hours', JSON.stringify(operatingHours))
      if (selectedFile) formData.append('image', selectedFile)

      await apiPost('/laundries/dashboard/my-laundry/', formData)
      await refreshLaundry()
      router.push('/onboarding/pending')
    } catch (err: unknown) {
      const apiErr = err as Error & { status?: number; message?: string }
      const is404 = apiErr.status === 404 || apiErr.message?.includes('404')

      if (is404) {
        saveOnboardingApplication(application)
        router.push('/onboarding/pending')
        return
      }

      let errorMsg = apiErr.message || 'Could not save your profile. Please try again.'
      const data = (apiErr as { data?: Record<string, string[]> }).data
      if (data && typeof data === 'object') {
        const key = Object.keys(data)[0]
        if (key && Array.isArray(data[key])) errorMsg = `${key}: ${data[key][0]}`
      }
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const updateDay = (index: number, patch: Partial<DayHours>) => {
    setOperatingHours((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Owner setup
        </p>
        <h1 className="text-2xl font-black tracking-tight">Set up your laundry</h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="flex items-center justify-between mb-8 gap-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors',
                idx <= currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground bg-card',
              )}
            >
              {idx < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span
              className={cn(
                'text-[10px] mt-2 font-bold text-center',
                idx <= currentStep ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="surface-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="font-black">{steps[currentStep].title}</CardTitle>
          <CardDescription className="font-medium">
            {currentStep === 0 && 'Tell customers about your shop.'}
            {currentStep === 1 && 'Address and delivery fees.'}
            {currentStep === 2 && 'When customers can reach you.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {currentStep === 0 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business name</FormLabel>
                        <FormControl>
                          <Input placeholder="Sunset Laundry" className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What makes your service stand out..."
                            className="min-h-[100px] rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+233 20 000 0000" className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Shop photo (optional)</FormLabel>
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {selectedFile ? (
                        <p className="text-sm font-semibold">{selectedFile.name}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setSelectedFile(file)
                        }}
                      />
                    </div>
                  </FormItem>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street address</FormLabel>
                        <FormControl>
                          <Input placeholder="Independence Ave" className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Accra" className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <FormField
                      control={form.control}
                      name="delivery_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery fee (GH₵)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" className="h-11 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pickup_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup fee (GH₵)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" className="h-11 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="min_order"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Minimum order (GH₵)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" className="h-11 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <Alert className="border-primary/20 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      Set your weekly hours. You can change these later in Business settings.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-3">
                    {operatingHours.map((day, index) => (
                      <div
                        key={day.day}
                        className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20"
                      >
                        <span className="w-24 text-sm font-semibold">{DAY_LABELS[index]}</span>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!day.is_closed}
                            onCheckedChange={(open) =>
                              updateDay(index, { is_closed: !open })
                            }
                          />
                          <span className="text-xs text-muted-foreground">
                            {day.is_closed ? 'Closed' : 'Open'}
                          </span>
                        </div>
                        {!day.is_closed && (
                          <>
                            <Input
                              type="time"
                              value={day.open}
                              onChange={(e) => updateDay(index, { open: e.target.value })}
                              className="w-[120px] h-9 rounded-lg"
                            />
                            <span className="text-muted-foreground text-sm">to</span>
                            <Input
                              type="time"
                              value={day.close}
                              onChange={(e) => updateDay(index, { close: e.target.value })}
                              className="w-[120px] h-9 rounded-lg"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isLoading}
                  className="rounded-xl font-semibold"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="rounded-xl font-bold shadow-glow-sm">
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="rounded-xl font-bold shadow-glow-sm">
                    {isLoading ? 'Submitting...' : 'Submit application'}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
