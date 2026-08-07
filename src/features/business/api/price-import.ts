import { apiGet, apiPost } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import type { PriceImportJob } from '../api-types'

export async function uploadPriceImport(sourceImage: File): Promise<PriceImportJob> {
  const formData = new FormData()
  formData.append('source_image', sourceImage)
  return unwrap<PriceImportJob>(await apiPost<unknown>('/laundries/dashboard/price-imports/', formData))
}

export async function getPriceImportJob(jobId: string): Promise<PriceImportJob> {
  return unwrap<PriceImportJob>(await apiGet<unknown>(`/laundries/dashboard/price-imports/${jobId}/`))
}

export async function confirmPriceImport(
  jobId: string,
  items: Array<{ item_name: string; unit_price: string; category?: string }>,
): Promise<{ created: string[]; skipped: string[]; job: PriceImportJob }> {
  return unwrap<{ created: string[]; skipped: string[]; job: PriceImportJob }>(
    await apiPost<unknown>(`/laundries/dashboard/price-imports/${jobId}/confirm/`, { items }),
  )
}
