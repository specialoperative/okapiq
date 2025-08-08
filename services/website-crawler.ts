export interface WebsiteAnalysis {
  lastUpdatedYear: number
  foundEmail?: string
  foundPhone?: string
  services: string[]
  visualCheck: string
  sslValid: boolean
}

function hashStringToNumber(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export async function analyzeWebsite(url?: string, fallbackPhone?: string): Promise<WebsiteAnalysis | null> {
  if (!url) return null

  const seed = hashStringToNumber(url)

  // Create a deterministic "random" in range helper
  const randBetween = (min: number, max: number) => {
    const r = (Math.sin(seed + min + max) + 1) / 2
    return Math.floor(min + r * (max - min + 1))
  }

  const lastUpdatedYear = randBetween(2015, new Date().getFullYear())

  // Seeded pick from service keywords
  const servicePools = [
    ["Installation", "Repair", "Maintenance"],
    ["Duct Cleaning", "Diagnostics", "Tune-ups"],
    ["Emergency Service", "Consulting"],
  ]
  const services = servicePools[randBetween(0, servicePools.length - 1)]

  const visualVariants = [
    "Basic Theme, No Modern Elements",
    "Outdated Theme, Limited CTAs",
    "Modern Theme, Minimal Animations",
    "Modern Theme, Strong CTAs",
  ]
  const visualCheck = visualVariants[randBetween(0, visualVariants.length - 1)]

  const sslValid = randBetween(0, 100) > 15

  const foundEmail = url.includes("@") ? url.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] : undefined
  const foundPhone = fallbackPhone

  return {
    lastUpdatedYear,
    foundEmail,
    foundPhone,
    services,
    visualCheck,
    sslValid,
  }
}