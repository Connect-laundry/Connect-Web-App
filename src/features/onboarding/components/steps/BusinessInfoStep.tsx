import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Leaf, Shirt } from 'lucide-react'
import { PhoneField } from '../fields/PhoneField'
import { SwitchField } from '../fields/SwitchField'
import { ImageUploadField } from '../fields/ImageUploadField'

interface BusinessInfoStepProps {
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
}

export const BusinessInfoStep = ({ selectedFile, setSelectedFile }: BusinessInfoStepProps) => {
  const form = useFormContext()

  return (
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

      <PhoneField />

      {/* Service attributes — surfaced to customers as filters/badges. */}
      <div className="space-y-3 rounded-lg border p-3">
        <SwitchField name="ironing_available" label="Ironing available" description="Offer ironing / pressing." icon={Shirt} />
        <SwitchField name="is_eco_friendly" label="Eco-friendly" description="Uses eco-friendly detergents / processes." icon={Leaf} />
      </div>

      <ImageUploadField selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </div>
  )
}
