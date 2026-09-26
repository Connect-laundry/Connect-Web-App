import { apiGet, apiPut } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'

export type PromoScope = 'PICKUP_AND_DELIVERY' | 'PICKUP_ONLY' | 'DELIVERY_ONLY'
export type PromoStatus = 'OFF' | 'SCHEDULED' | 'RUNNING' | 'ENDED'

/**
 * The laundry's free pickup/delivery promo. Rates are Simame's and are not
 * part of this; an owner-run promo is always laundry funded, which the
 * server enforces.
 */
export interface OwnerPromotion {
  enabled: boolean
  scope: PromoScope
  name: string
  start_at: string | null
  end_at: string | null
  min_order_value: string | null
  max_distance_km: string | null
  funded_by: 'LAUNDRY' | 'SIMAME'
  status: PromoStatus
}

export type OwnerPromotionUpdate = Partial<
  Pick<OwnerPromotion, 'enabled' | 'scope' | 'name' | 'start_at' | 'end_at' | 'min_order_value' | 'max_distance_km'>
>

const PATH = '/laundries/dashboard/my-laundry/promotion/'

export async function getPromotion(): Promise<OwnerPromotion> {
  return unwrap<OwnerPromotion>(await apiGet<unknown>(PATH))
}

export async function savePromotion(update: OwnerPromotionUpdate): Promise<OwnerPromotion> {
  return unwrap<OwnerPromotion>(await apiPut<unknown>(PATH, update))
}
