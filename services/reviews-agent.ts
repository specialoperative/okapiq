export interface ReviewsSummary {
  avgSentiment: number // 0 - 1
  themes: string[]
  reviewCount: number
  lastReviewDaysAgo: number
}

function hash(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export async function summarizeReviews(businessName: string): Promise<ReviewsSummary> {
  const seed = hash(businessName)
  const rand = (n: number) => (Math.sin(seed + n) + 1) / 2

  const avgSentiment = Math.round((0.5 + rand(1) * 0.5) * 100) / 100
  const reviewCount = 10 + Math.floor(rand(2) * 300)
  const lastReviewDaysAgo = 1 + Math.floor(rand(3) * 365)

  const themePool = [
    "fast service",
    "friendly technician",
    "slightly expensive",
    "great communication",
    "on-time arrival",
    "quality workmanship",
    "long wait time",
    "upfront pricing",
  ]
  const themes = [themePool[Math.floor(rand(4) * themePool.length)], themePool[Math.floor(rand(5) * themePool.length)]]

  return {
    avgSentiment,
    themes: Array.from(new Set(themes)),
    reviewCount,
    lastReviewDaysAgo,
  }
}