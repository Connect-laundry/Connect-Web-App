import { apiGet, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList } from '@/shared/api/unwrap'

export async function getAnalyticsSummary() {
  const response = await apiGet<any>('/analytics/summary/')
  return unwrap<any>(response)
}

export async function ingestAnalyticsEvent(data: Record<string, unknown>) {
  await apiPost('/analytics/events/', data)
}

export async function getAnalyticsDashboards() {
  const response = await apiGet<any>('/analytics/dashboards/')
  return unwrapList<any>(response)
}
