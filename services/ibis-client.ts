export interface IndustryReport {
  industry: string
  marketSize: number // in USD
  growthRate: number // percentage
  fragmentationScore: number // 0-100, 100 being most fragmented
  competitorCount: number
  avgRevenue: number
  avgEmployeeCount: number
  profitMargin: number // percentage
}

export class IbisClient {
  private apiKey: string
  private baseUrl = "https://api.ibisworld.com/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getIndustryReport(industry: string): Promise<IndustryReport | null> {
    try {
      // In a real implementation, this would make an API call to Ibis
      // For now, we'll simulate a response
      console.log(`Getting industry report from Ibis: ${industry}`)

      // Simulate API response delay
      await new Promise((resolve) => setTimeout(resolve, 700))

      // Industry-specific mock data
      const mockData: Record<string, Partial<IndustryReport>> = {
        landscaping: {
          fragmentationScore: 89,
          marketSize: 105000000000,
          growthRate: 4.2,
          competitorCount: 604000,
          avgRevenue: 500000,
          avgEmployeeCount: 8,
          profitMargin: 15,
        },
        hvac: {
          fragmentationScore: 78,
          marketSize: 120000000000,
          growthRate: 3.9,
          competitorCount: 118000,
          avgRevenue: 1200000,
          avgEmployeeCount: 12,
          profitMargin: 20,
        },
        cleaning: {
          fragmentationScore: 92,
          marketSize: 78000000000,
          growthRate: 5.3,
          competitorCount: 1100000,
          avgRevenue: 300000,
          avgEmployeeCount: 14,
          profitMargin: 12,
        },
        "auto detailing": {
          fragmentationScore: 85,
          marketSize: 12400000000,
          growthRate: 6.1,
          competitorCount: 62000,
          avgRevenue: 400000,
          avgEmployeeCount: 6,
          profitMargin: 18,
        },
        ecommerce: {
          fragmentationScore: 75,
          marketSize: 969000000000,
          growthRate: 10.2,
          competitorCount: 2100000,
          avgRevenue: 1000000,
          avgEmployeeCount: 7,
          profitMargin: 25,
        },
      }

      // Get data for the specific industry, or use default data if not found
      const industryData = mockData[industry.toLowerCase()] || {
        fragmentationScore: Math.floor(Math.random() * 30) + 70, // 70-99
        marketSize: (Math.floor(Math.random() * 90) + 10) * 1000000000, // $10B-$100B
        growthRate: Math.floor(Math.random() * 10) + 2, // 2-12%
        competitorCount: (Math.floor(Math.random() * 90) + 10) * 10000, // 100k-1M
        avgRevenue: (Math.floor(Math.random() * 9) + 1) * 100000, // $100k-$1M
        avgEmployeeCount: Math.floor(Math.random() * 15) + 5, // 5-20
        profitMargin: Math.floor(Math.random() * 15) + 10, // 10-25%
      }

      return {
        industry,
        ...industryData,
      } as IndustryReport
    } catch (error) {
      console.error("Error in Ibis client:", error)
      return null
    }
  }
}

