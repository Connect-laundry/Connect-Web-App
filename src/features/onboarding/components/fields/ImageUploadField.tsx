import { useEffect, useState } from 'react'
import { FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/ui/form'
import { Button } from '@/shared/ui/button'
import { Store } from 'lucide-react'

interface ImageUploadFieldProps {
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
  inputId?: string
}

/** Click-to-upload image dropzone with a live preview. */
export const ImageUploadField = ({
  selectedFile,
  setSelectedFile,
  inputId = 'image-upload',
}: ImageUploadFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {

    if (!selectedFile) return;

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selectedFile)
  }, [selectedFile])

  return (
    <FormItem>
      <FormLabel>Business Image (optional)</FormLabel>
      <FormControl>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById(inputId)?.click()}
        >
          {selectedFile && preview ? (
            <div className="text-center space-y-3">
              <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden border bg-background flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Business logo preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground truncate max-w-[200px] mx-auto">
                  {selectedFile.name}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                  }}
                  className="mt-1 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/5"
                >
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Store className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload your logo or flyer</p>
            </div>
          )}
          <input
            id={inputId}
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
      <FormDescription>Upload a clear photo, logo, or flyer of your laundry.</FormDescription>
      <FormMessage />
    </FormItem>
  )
}
