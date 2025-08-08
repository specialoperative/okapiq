export interface GooglePlace {
  placeId: string
  name: string
  address: string
  rating?: number
  totalReviews?: number
  website?: string
  phone?: string
  location?: {
    lat: number
    lng: number
  }
}

export interface GoogleSearchParams {
  query: string // e.g., "HVAC near Phoenix"
  limit?: number
}

const PLACES_TEXTSEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
const PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

export async function searchGooglePlaces(params: GoogleSearchParams): Promise<GooglePlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const limit = Math.min(params.limit ?? 5, 10)

  if (!apiKey) {
    console.warn("GOOGLE_PLACES_API_KEY not set; returning mock Google results.")
    return getMockGooglePlaces(params.query, limit)
  }

  const url = `${PLACES_TEXTSEARCH_URL}?query=${encodeURIComponent(params.query)}&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`Google Places TextSearch failed: ${res.status} ${res.statusText}`)
    return getMockGooglePlaces(params.query, limit)
  }

  const data = await res.json()
  const results = Array.isArray(data.results) ? data.results.slice(0, limit) : []

  const places: GooglePlace[] = []
  for (const r of results) {
    const place: GooglePlace = {
      placeId: r.place_id,
      name: r.name,
      address: r.formatted_address,
      rating: r.rating,
      totalReviews: r.user_ratings_total,
      location: r.geometry?.location ? { lat: r.geometry.location.lat, lng: r.geometry.location.lng } : undefined,
    }

    // Fetch details to enrich website and phone if possible
    const details = await fetchPlaceDetails(r.place_id, apiKey)
    if (details) {
      place.website = details.website
      place.phone = details.international_phone_number || details.formatted_phone_number
    }

    places.push(place)
  }

  return places
}

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<any | null> {
  const fields = [
    "name",
    "formatted_phone_number",
    "international_phone_number",
    "website",
    "opening_hours",
    "url",
  ].join(",")

  const url = `${PLACES_DETAILS_URL}?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  return data?.result ?? null
}

function getMockGooglePlaces(query: string, limit: number): GooglePlace[] {
  const baseNames = [
    "AirLogic HVAC",
    "Cold Breeze HVAC",
    "Elite HVAC Solutions",
    "Phoenix Cooling Pros",
    "Desert Air & Heat",
    "Comfort Zone Heating",
  ]

  return baseNames.slice(0, limit).map((name, idx) => ({
    placeId: `mock_place_${idx}`,
    name,
    address: "Phoenix, AZ",
    rating: 4 + Math.random(),
    totalReviews: Math.floor(50 + Math.random() * 300),
    website: undefined,
    phone: undefined,
    location: { lat: 33.45 + Math.random() * 0.02, lng: -112.07 + Math.random() * 0.02 },
  }))
}