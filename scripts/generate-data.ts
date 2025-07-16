import { faker } from "@faker-js/faker"

interface SMBData {
  id: string
  name: string
  industry: string
  location: {
    city: string
    state: string
    zipCode: string
  }
  employees: number
  annualRevenue: number
  yearsInBusiness: number
  contact: {
    phone: string
    email: string
    website: string
  }
  socialMedia: {
    facebook: string
    twitter: string
    linkedin: string
  }
  financials: {
    revenueGrowthRate: number
    profitMargin: number
    customerAcquisitionCost: number
    customerLifetimeValue: number
    conversionRate: number
  }
  fundingStatus: string
  targetMarket: string
  marketingStrategies: string[]
  geographicSuitabilityScore: number
  geographicSuitabilityReason: string
  startupCost: number
  timeToROI: number
  recommendedAdSpend: number
  easeOfMarketEntryScore: number
  easeOfMarketEntryReason: string
}

function generateSMBData(count: number): SMBData[] {
  const data: SMBData[] = []

  for (let i = 0; i < count; i++) {
    const smb: SMBData = {
      id: faker.string.uuid(),
      name: faker.company.name(),
      industry: faker.company.buzzPhrase(),
      location: {
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
      },
      employees: faker.number.int({ min: 1, max: 1000 }),
      annualRevenue: faker.number.int({ min: 100000, max: 10000000 }),
      yearsInBusiness: faker.number.int({ min: 1, max: 50 }),
      contact: {
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
      },
      socialMedia: {
        facebook: `https://facebook.com/${faker.internet.userName()}`,
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        linkedin: `https://linkedin.com/company/${faker.company.name().toLowerCase().replace(/\s+/g, "-")}`,
      },
      financials: {
        revenueGrowthRate: faker.number.float({ min: -20, max: 100, precision: 0.1 }),
        profitMargin: faker.number.float({ min: -10, max: 40, precision: 0.1 }),
        customerAcquisitionCost: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
        customerLifetimeValue: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
        conversionRate: faker.number.float({ min: 0.1, max: 10, precision: 0.1 }),
      },
      fundingStatus: faker.helpers.arrayElement(["Bootstrapped", "Seed", "Series A", "Series B", "Series C"]),
      targetMarket: faker.lorem.sentence(),
      marketingStrategies: faker.helpers.arrayElements(
        ["SEO", "Social Media Marketing", "Content Marketing", "Email Marketing", "Paid Advertising"],
        { min: 1, max: 3 },
      ),
      geographicSuitabilityScore: faker.number.int({ min: 1, max: 100 }),
      geographicSuitabilityReason: faker.lorem.sentence(),
      startupCost: faker.number.int({ min: 10000, max: 1000000 }),
      timeToROI: faker.number.int({ min: 3, max: 60 }),
      recommendedAdSpend: faker.number.int({ min: 1000, max: 100000 }),
      easeOfMarketEntryScore: faker.number.int({ min: 1, max: 100 }),
      easeOfMarketEntryReason: faker.lorem.sentence(),
    }

    data.push(smb)
  }

  return data
}

// Generate 1,000,000 SMB data points
const smbData = generateSMBData(1000000)

// In a real scenario, you would save this data to a database
console.log(`Generated ${smbData.length} SMB data points`)
