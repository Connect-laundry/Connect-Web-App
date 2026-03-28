'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { useAuth } from '@/features/auth/context/AuthContext'
import { apiPost } from '@/shared/api/client'
import { Check, ChevronRight, ChevronLeft, Store, MapPin, Clock } from 'lucide-react'

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
  image: z.any().optional(),
})

type SetupFormValues = z.infer<typeof setupSchema>

const steps = [
  { id: 'basis', title: 'Basic Info', icon: Store },
  { id: 'location', title: 'Location & Logistics', icon: MapPin },
  { id: 'hours', title: 'Operating Hours', icon: Clock },
]

export function OnboardingWizard() {
  const router = useRouter()
  const { refreshLaundry } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: '',
      description: '',
      phone_number: '',
      address: '',
      city: '',
      delivery_fee: '0',
      pickup_fee: '0',
      min_order: '0',
      latitude: '5.6037', // Default to Accra
      longitude: '-0.1870', // Default to Accra
    },
  })

  // State to track the selected file for the image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const nextStep = async () => {
    const fields = currentStep === 0 
      ? ['name', 'description', 'phone_number'] as const
      : ['address', 'city', 'delivery_fee', 'pickup_fee', 'min_order'] as const
    
    const isValid = await form.trigger(fields)
    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }



  async function onSubmit(values: SetupFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      console.log('[connectlaundry.app] Submitting onboarding data:', values)
      
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
      
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      // Add default operating hours as JSON string if backend expects it
      formData.append('operating_hours', JSON.stringify([]))

      await apiPost('/laundries/dashboard/my-laundry/', formData)

      await refreshLaundry()
      router.push('/onboarding/pending')
    } catch (err: any) {
      console.error('[connectlaundry.app] Onboarding Submission Error Message:', err.message)
      console.error('[connectlaundry.app] Onboarding Submission Error Status:', err.status)
      console.error('[connectlaundry.app] Onboarding Submission Full Data:', err.data)
      
      // Extract detailed field errors if available
      let errorMsg = err.message || 'Failed to create business profile.'
      if (err.data && typeof err.data === 'object') {
        const firstErrorKey = Object.keys(err.data)[0]
        if (firstErrorKey && Array.isArray(err.data[firstErrorKey])) {
          errorMsg = `${firstErrorKey}: ${err.data[firstErrorKey][0]}`
        }
      }
      
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                idx <= currentStep ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {idx < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs mt-2 font-medium ${idx <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
            {idx < steps.length - 1 && (
              <div className={`absolute top-5 left-[60%] w-[80%] h-[2px] -z-10 bg-muted ${idx < currentStep ? 'bg-primary' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>
            {currentStep === 0 && 'Tell us about your laundry business.'}
            {currentStep === 1 && 'Set up your location and delivery prices.'}
            {currentStep === 2 && 'When is your laundry open?'}
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Sunset Laundry Pros" {...field} />
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
                                placeholder="Best dry cleaning service in the city..." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>Tell customers what makes your service unique.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+233 20 000 0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Image Upload Field */}
                      <FormItem>
                        <FormLabel>Business Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                               onClick={() => document.getElementById('image-upload')?.click()}>
                            {selectedFile ? (
                              <div className="text-center">
                                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                  className="mt-2 text-xs"
                                >
                                  Change Image
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Store className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Click to upload business photo</p>
                              </div>
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
                        </FormControl>
                        <FormDescription>Upload a clear photo of your laundry shop.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Independence Ave, Ridge" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Accra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <FormField
                          control={form.control}
                          name="delivery_fee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Fee (GH₵)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
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
                              <FormLabel>Pickup Fee (GH₵)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
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
                              <FormLabel>Minimum Order Amount (GH₵)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Almost Done!</h3>
                      <p className="text-muted-foreground">
                        Your business will be set to standard operating hours (8AM - 6PM). 
                        You can customize these later in your dashboard settings.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Profile...' : 'Complete Registration'}
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
