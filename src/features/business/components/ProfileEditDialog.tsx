'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Pencil } from 'lucide-react'
import type { Laundry } from '@/shared/interfaces'
import { useProfileEditor } from '../hooks/useProfileEditor'

interface ProfileEditDialogProps {
  laundry: Laundry
  onSaved: (updated: Laundry) => void
}

export function ProfileEditDialog({ laundry, onSaved }: ProfileEditDialogProps) {
  const { open, setOpen, draft, updateDraft: set, isSaving, error, openEditor, save } =
    useProfileEditor(laundry, onSaved)

  return (
    <>
      <Button variant="outline" size="sm" onClick={openEditor}>
        <Pencil className="mr-2 h-4 w-4" /> Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Business Profile</DialogTitle>
            <DialogDescription>
              Update your business details. Changes are visible to customers right away.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biz-name">Business name</Label>
              <Input
                id="biz-name"
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biz-description">Description</Label>
              <Textarea
                id="biz-description"
                rows={3}
                value={draft.description}
                onChange={(e) => set({ description: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="biz-phone">Phone</Label>
                <Input
                  id="biz-phone"
                  type="tel"
                  value={draft.phone_number}
                  onChange={(e) => set({ phone_number: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-city">City</Label>
                <Input
                  id="biz-city"
                  value={draft.city}
                  onChange={(e) => set({ city: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biz-address">Address</Label>
              <Input
                id="biz-address"
                value={draft.address}
                onChange={(e) => set({ address: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="biz-delivery">Delivery (hrs)</Label>
                <Input
                  id="biz-delivery"
                  type="number"
                  min="1"
                  value={draft.estimated_delivery_hours}
                  onChange={(e) => set({ estimated_delivery_hours: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-radius">Radius (km)</Label>
                <Input
                  id="biz-radius"
                  type="number"
                  step="0.5"
                  min="0"
                  value={draft.service_radius_km}
                  onChange={(e) => set({ service_radius_km: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-minorder">Min order (GH₵)</Label>
                <Input
                  id="biz-minorder"
                  type="number"
                  step="0.01"
                  min="0"
                  value={draft.min_order}
                  onChange={(e) => set({ min_order: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-3">
              <label className="flex items-center justify-between text-sm font-medium">
                Express service
                <Switch
                  checked={draft.express_available}
                  onCheckedChange={(v) => set({ express_available: v })}
                  disabled={isSaving}
                />
              </label>
              {draft.express_available && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="biz-express-hrs">Turnaround (hrs)</Label>
                    <Input
                      id="biz-express-hrs"
                      type="number"
                      min="1"
                      placeholder="e.g. 12"
                      value={draft.express_delivery_hours}
                      onChange={(e) => set({ express_delivery_hours: e.target.value })}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-express-pct">Extra charge (%)</Label>
                    <Input
                      id="biz-express-pct"
                      type="number"
                      min="1"
                      placeholder="e.g. 50"
                      value={draft.express_surcharge_percent}
                      onChange={(e) => set({ express_surcharge_percent: e.target.value })}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={draft.ironing_available}
                  onCheckedChange={(v) => set({ ironing_available: v })}
                  disabled={isSaving}
                />
                Ironing available
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={draft.is_eco_friendly}
                  onCheckedChange={(v) => set({ is_eco_friendly: v })}
                  disabled={isSaving}
                />
                Eco-friendly
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
