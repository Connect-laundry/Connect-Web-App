'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Plus, Edit2, Trash2, Power } from 'lucide-react'
import { Service } from '@/lib/types'
import { getServices, deleteService, toggleServiceStatus } from '@/lib/api/business'
import { ServiceModal } from '@/components/business/ServiceModal'

export default function BusinessPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const data = await getServices()
      setServices(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleAddClick = () => {
    setSelectedService(null)
    setModalOpen(true)
  }

  const handleEditClick = (service: Service) => {
    setSelectedService(service)
    setModalOpen(true)
  }

  const handleDeleteClick = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      await deleteService(serviceId)
      setServices(services.filter(s => s.id !== serviceId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete service')
    }
  }

  const handleToggleStatus = async (service: Service) => {
    try {
      const updated = await toggleServiceStatus(service.id, !service.is_active)
      setServices(services.map(s => s.id === updated.id ? updated : s))
    } catch (err: any) {
      setError(err.message || 'Failed to update service status')
    }
  }

  const handleServiceSaved = (savedService: Service) => {
    if (selectedService) {
      setServices(services.map(s => s.id === savedService.id ? savedService : s))
    } else {
      setServices([...services, savedService])
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your laundry business profile</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="services">Services & Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Manage your business information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Business profile settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Set your business hours for each day</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Operating hours configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Services & Pricing</CardTitle>
                <CardDescription>Manage your services and pricing</CardDescription>
              </div>
              <Button onClick={handleAddClick}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : services.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Service Name</th>
                        <th className="pb-3 font-medium">Wash (₦)</th>
                        <th className="pb-3 font-medium">Iron (₦)</th>
                        <th className="pb-3 font-medium">Dry Clean (₦)</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {services.map((service) => (
                        <tr key={service.id} className="group">
                          <td className="py-4 font-medium">{service.name}</td>
                          <td className="py-4">{service.wash_price.toLocaleString()}</td>
                          <td className="py-4">{service.iron_price.toLocaleString()}</td>
                          <td className="py-4">{service.dry_clean_price.toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(service)}
                                title={service.is_active ? 'Deactivate' : 'Activate'}
                              >
                                <Power className={`w-4 h-4 ${service.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(service)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(service.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No services configured yet.</p>
                  <Button variant="outline" onClick={handleAddClick}>
                    Add your first service
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ServiceModal
        service={selectedService}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onServiceSaved={handleServiceSaved}
      />
    </div>
  )
}

