/**
 * Shrink large phone photos before upload. Requests pass through the Next.js
 * proxy, whose hosting caps request bodies (~4.5 MB on Vercel), and a 12 MP
 * photo is usually bigger than that. 2560 px on the long edge is the size the
 * server reads at anyway, so small price text survives. The server still does
 * all real validation (type sniffing, decoding, metadata stripping).
 */

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const LONG_EDGE = 2560
const SHRINK_ABOVE_BYTES = 3.5 * 1024 * 1024
export const HARD_LIMIT_BYTES = 4.2 * 1024 * 1024

export interface PreparedUpload {
  blob: Blob
  filename: string
}

export async function prepareUpload(file: File): Promise<PreparedUpload> {
  const bitmap = await decode(file)
  if (!bitmap) return { blob: file, filename: file.name || 'price-list.jpg' }
  try {
    const long = Math.max(bitmap.width, bitmap.height)
    if (long <= LONG_EDGE && file.size <= SHRINK_ABOVE_BYTES) {
      return { blob: file, filename: file.name || 'price-list.jpg' }
    }
    const scale = Math.min(1, LONG_EDGE / long)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return { blob: file, filename: file.name }
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    for (const quality of [0.9, 0.8, 0.7]) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
      if (blob && blob.size <= HARD_LIMIT_BYTES) return { blob, filename: 'price-list.jpg' }
    }
    return { blob: file, filename: file.name }
  } finally {
    bitmap.close?.()
  }
}

async function decode(file: File): Promise<ImageBitmap | null> {
  if (typeof createImageBitmap !== 'function') return null
  try {
    // Honour the camera's EXIF rotation so the canvas copy is upright.
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return null // e.g. HEIC on browsers that can't decode it; the server explains
  }
}
