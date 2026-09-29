import { NextResponse } from 'next/server'
import { SITE_URL, getPublicSitemapEntries } from '@/shared/lib/seo'

function sitemapUrls() {
  return getPublicSitemapEntries().map((entry) => entry.url)
}

export const INDEXNOW_KEY = '4f89d3a7e6b241c890f5a7e1c3b5d2e4'
export const INDEXNOW_KEY_LOCATION = `https://simame.tech/${INDEXNOW_KEY}.txt`
export const INDEXNOW_HOST = 'simame.tech'

export async function GET() {
  return NextResponse.json({
    status: 'configured',
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    endpoint: 'https://api.indexnow.org/indexnow',
    submittableUrlsCount: sitemapUrls().length,
  })
}

export async function POST(request: Request) {
  try {
    let urlsToSubmit: string[] = []
    
    // Check if custom urlList provided
    try {
      const body = await request.json()
      if (Array.isArray(body?.urlList)) {
        // Only our own pages: this endpoint is public, so never relay arbitrary URLs.
        urlsToSubmit = body.urlList.filter(
          (url: unknown): url is string => typeof url === 'string' && url.startsWith(`${SITE_URL}/`),
        )
      }
    } catch {
      // Body empty or not JSON; fall back to all canonical inventory paths
    }

    if (urlsToSubmit.length === 0) {
      urlsToSubmit = sitemapUrls()
    }

    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urlsToSubmit,
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    return NextResponse.json({
      success: response.ok || response.status === 200 || response.status === 202,
      indexNowStatus: response.status,
      submittedUrlsCount: urlsToSubmit.length,
      urls: urlsToSubmit,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during IndexNow submission',
      },
      { status: 500 },
    )
  }
}
