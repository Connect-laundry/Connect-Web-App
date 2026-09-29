import { NextResponse, type NextRequest } from 'next/server'
import { GOOGLE_PLAY_URL, GOOGLE_PLAY_WEBSITE_URL } from '@/shared/lib/seo'

const CAMPAIGN_SOURCE = /^[a-z0-9_-]{1,40}$/i

// Short, printable link (flyers, QR codes, social bios) to the Play listing.
// `/download?src=knust-flyer` tags the install in Play Console's UTM report.
// Temporary redirect so the target can change, e.g. to a store picker once iOS ships.
export function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('src')
  if (source && CAMPAIGN_SOURCE.test(source)) {
    const referrer = encodeURIComponent(`utm_source=${source}&utm_medium=link&utm_campaign=download`)
    return NextResponse.redirect(`${GOOGLE_PLAY_URL}&referrer=${referrer}`, 307)
  }
  return NextResponse.redirect(GOOGLE_PLAY_WEBSITE_URL, 307)
}
