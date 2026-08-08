import { NextRequest, NextResponse } from 'next/server'

const UA = 'Simame/1.0 (owner onboarding geocoder)'
// Ghana's approximate geographic centre — biases ranking toward local results.
const GH_BIAS = '&lat=7.9465&lon=-1.0232'

/** Map a Photon GeoJSON feature to our flat result shape. */
function mapFeature(f: any) {
  const coords = f?.geometry?.coordinates
  if (!Array.isArray(coords) || coords.length < 2) return null
  const p = f.properties ?? {}
  const seen = new Set<string>()
  const formatted = [p.name, p.street, p.district, p.city, p.state, p.country]
    .filter((part: any): part is string => Boolean(part) && !seen.has(part) && !!seen.add(part))
    .join(', ')
  return {
    latitude: Number(coords[1]),
    longitude: Number(coords[0]),
    formatted_address: formatted,
    city: p.city || p.county || p.state || '',
  }
}

async function fetchPhoton(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Geocoder returned ${res.status}.`)
  const data = await res.json()
  const features = Array.isArray(data?.features) ? data.features : []
  return features.map(mapFeature).filter(Boolean)
}

/**
 * Address geocoding proxy (Photon / OpenStreetMap, no API key).
 * - Forward search:  ?q=<text>&limit=<n>   -> ranked suggestions
 * - Reverse lookup:  ?lat=<n>&lon=<n>       -> address for coordinates
 * Proxied server-side so the browser never calls Photon directly.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const q = sp.get('q')?.trim()
  const lat = sp.get('lat')
  const lon = sp.get('lon')

  try {
    // Reverse geocode (coordinates -> address).
    if (lat && lon && !q) {
      const url = `https://photon.komoot.io/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&lang=en`
      const results = await fetchPhoton(url)
      return NextResponse.json({ results })
    }

    // Forward search (text -> ranked suggestions).
    if (!q || q.length < 3) {
      return NextResponse.json({ results: [] })
    }
    const limit = Number(sp.get('limit')) || 6
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=${limit}&lang=en${GH_BIAS}`
    const results = await fetchPhoton(url)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Geocoding service unreachable.', results: [] }, { status: 502 })
  }
}
