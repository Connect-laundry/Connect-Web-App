'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'

import { useBusinessProfile } from '@/features/business/hooks/useBusinessProfile'
import { BusinessHeader } from '@/features/business/components/BusinessHeader'
import { BusinessProfileCard } from '@/features/business/components/BusinessProfileCard'
import { HoursEditor } from '@/features/business/components/HoursEditor'
import { ServicesPricingTab } from '@/features/business/components/ServicesPricingTab'

export default function BusinessPage() {
  const {
    laundry,
    setLaundry,
    pricingItems,
    setPricingItems,
    weightPricing,
    setWeightPricing,
    isLoading,
    isTogglingVacation,
    error,
    onVacationToggle,
    usesItems,
    usesWeight,
    getPricingItems,
  } = useBusinessProfile()

  return (
    <div className="p-8">
      <BusinessHeader
        laundry={laundry}
        isTogglingVacation={isTogglingVacation}
        onVacationToggle={onVacationToggle}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
            <TabsTrigger value="hours">Operating Hours</TabsTrigger>
            <TabsTrigger value="services">Services &amp; Pricing</TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <BusinessProfileCard laundry={laundry} onSaved={setLaundry} />
          </TabsContent>

          {/* Operating Hours Tab */}
          <TabsContent value="hours" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
                <CardDescription>Your business hours for each day</CardDescription>
              </CardHeader>
              <CardContent>
                {laundry ? (
                  <HoursEditor laundry={laundry} onSaved={setLaundry} />
                ) : (
                  <p className="text-muted-foreground">No business profile found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services & Pricing Tab */}
          <TabsContent value="services" className="mt-6">
            <ServicesPricingTab
              usesWeight={usesWeight}
              usesItems={usesItems}
              weightPricing={weightPricing}
              setWeightPricing={setWeightPricing}
              pricingItems={pricingItems}
              setPricingItems={setPricingItems}
              getPricingItems={getPricingItems}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
