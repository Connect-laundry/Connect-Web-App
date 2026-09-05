export const PRODUCTION_BACKEND_BASE_URL =
  'https://connect-full-backend-production.onrender.com/api/v1'

export const STAGING_BACKEND_BASE_URL =
  'https://connect-full-backend.onrender.com/api/v1'

function cleanUrl(url: string) {
  return url.replace(/\/+$/, '')
}

function normalizeHost(host?: string | null) {
  return (host || '').split(':')[0].toLowerCase()
}

export function resolveBackendBaseUrl(host?: string | null) {
  const normalizedHost = normalizeHost(host)
  const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || ''
  const targetEnv = process.env.VERCEL_TARGET_ENV || process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV || ''
  const gitBranch = process.env.VERCEL_GIT_COMMIT_REF || ''

  if (normalizedHost === 'simame.tech' || normalizedHost === 'www.simame.tech' || vercelEnv === 'production') {
    return PRODUCTION_BACKEND_BASE_URL
  }

  if (
    normalizedHost === 'staging.simame.tech' ||
    vercelEnv === 'preview' ||
    targetEnv === 'preview' ||
    targetEnv === 'staging' ||
    gitBranch === 'develop'
  ) {
    return STAGING_BACKEND_BASE_URL
  }

  return cleanUrl(process.env.NEXT_PUBLIC_API_BASE_URL || PRODUCTION_BACKEND_BASE_URL)
}

