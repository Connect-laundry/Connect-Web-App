'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/shared/interfaces'
import { createService, updateService } from '@/features/business/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ServiceModalProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceSaved: (service: Service) => void
}

export function ServiceModal({
  service,
  open,
  onOpenChange,
  onServiceSaved,
}: ServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    wash_price: 0,
    iron_price: 0,
    dry_clean_price: 0,
    is_active: true,
  })

  useEffect(() => {
    Promise.resolve().then(() => {
      if (service) {
        setFormData({
          name: service.name,
          wash_price: service.wash_price,
          iron_price: service.iron_price,
          dry_clean_price: service.dry_clean_price,
          is_active: service.is_active,
        })
      } else {
        setFormData({
          name: '',
          wash_price: 0,
          iron_price: 0,
          dry_clean_price: 0,
          is_active: true,
        })
      }
      setError(null)
    })
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let savedService: Service
      if (service) {
        savedService = await updateService(service.id, formData)
      } else {
        savedService = await createService(formData)
      }
      onServiceSaved(savedService)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save service')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {service ? 'Update your service details and pricing.' : 'Add a new service to your business offerings.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="e.g. Wash & Fold, Suit Dry Clean"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="wash_price">Wash Price (GH₵)</Label>
              <Input
                id="wash_price"
                type="number"
                min="0"
                value={formData.wash_price}
                onChange={(e) => setFormData({ ...formData, wash_price: Number(e.target.value) })}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="iron_price">Iron Price (GH₵)</Label>
              <Input
                id="iron_price"
                type="number"
                min="0"
                value={formData.iron_price}
                onChange={(e) => setFormData({ ...formData, iron_price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="dry_clean_price">Dry Clean Price (GH₵)</Label>
            <Input
              id="dry_clean_price"
              type="number"
              min="0"
              value={formData.dry_clean_price}
              onChange={(e) => setFormData({ ...formData, dry_clean_price: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              {service ? 'Save Changes' : 'Add Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
