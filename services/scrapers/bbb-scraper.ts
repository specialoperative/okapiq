/**
 * Better Business Bureau (BBB) Scraper
 * 
 * Scrapes business data from BBB directory for additional validation
 */

import { BusinessData, Review, ScrapingResult } from '../../types/fragment-finder';

export class BBBScraper {
  private readonly baseUrl = 'https://www.bbb.org';
  private readonly requestDelay = 2000; // 2 seconds between requests

  constructor() {
    // Initialize scraper with rate limiting
  }

  /**
   * Scrapes businesses from BBB for a given location and industry
   */
  async scrapeBusinesses(
    zip: string, 
    industry: string, 
    maxResults: number = 100
  ): Promise<BusinessData[]> {
    try {
      console.log(`Scraping BBB for ${industry} businesses in ${zip}...`);
      
      // In a real implementation, this would make HTTP requests to BBB
      // For demo purposes, we'll return simulated data
      return this.generateSimulatedBBBData(zip, industry, maxResults);
      
    } catch (error) {
      console.error('Error scraping BBB:', error);
      return [];
    }
  }

  /**
   * Generates simulated BBB data for demonstration
   */
  private generateSimulatedBBBData(
    zip: string, 
    industry: string, 
    maxResults: number
  ): BusinessData[] {
    const businesses: BusinessData[] = [];
    const businessNames = this.getIndustryBusinessNames(industry);
    
    // BBB typically has fewer businesses but higher quality data
    const actualCount = Math.min(maxResults, Math.floor(businessNames.length * 0.6));
    
    for (let i = 0; i < actualCount; i++) {
      const business: BusinessData = {
        id: `bbb_${zip}_${i}`,
        name: businessNames[i],
        address: this.generateAddress(zip),
        phone: this.generatePhoneNumber(),
        website: Math.random() > 0.2 ? this.generateWebsite(businessNames[i]) : undefined,
        industry,
        zip,
        estimatedRevenue: this.estimateRevenue(industry),
        employees: Math.floor(Math.random() * 40) + 2, // BBB businesses tend to be slightly larger
        reviewCount: Math.floor(Math.random() * 100) + 5,
        averageRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0 (BBB rated)
        reviews: this.generateReviews(Math.floor(Math.random() * 6) + 2),
        businessAge: Math.floor(Math.random() * 30) + 2, // BBB businesses tend to be more established
        ownerAge: Math.random() > 0.5 ? Math.floor(Math.random() * 25) + 45 : undefined,
        dataSource: 'bbb',
        dataQuality: Math.random() * 0.3 + 0.7, // 0.7-1.0 (BBB has good data quality)
        lastUpdated: new Date().toISOString()
      };
      
      businesses.push(business);
    }
    
    return businesses;
  }

  /**
   * Gets industry-specific business names for simulation
   */
  private getIndustryBusinessNames(industry: string): string[] {
    const industryNames: { [key: string]: string[] } = {
      restaurants: [
        "Established Eatery", "Heritage Restaurant", "Trusted Dining", "Quality Kitchen",
        "Professional Catering", "Reliable Restaurant Co", "Certified Food Service", "Accredited Bistro",
        "Licensed Restaurant Group", "Professional Dining", "Quality Food Service", "Established Kitchen",
        "Certified Catering Co", "Professional Restaurant", "Quality Dining Service", "Trusted Kitchen"
      ],
      'auto repair': [
        "Certified Auto Repair", "Licensed Mechanics", "Professional Auto Service", "Accredited Auto Care",
        "Reliable Auto Repair", "Certified Automotive", "Professional Mechanics", "Licensed Auto Service",
        "Quality Auto Repair Co", "Certified Car Care", "Professional Auto Solutions", "Accredited Mechanics",
        "Reliable Car Service", "Licensed Auto Care", "Professional Vehicle Service", "Certified Auto Works"
      ],
      'hair salons': [
        "Licensed Beauty Salon", "Professional Hair Studio", "Certified Stylists", "Accredited Salon",
        "Quality Hair Service", "Professional Beauty", "Licensed Hair Design", "Certified Beauty Studio",
        "Professional Salon Co", "Quality Hair Studio", "Licensed Beauty Care", "Certified Hair Artists",
        "Professional Hair Care", "Accredited Beauty Salon", "Quality Styling Studio", "Licensed Hair Studio"
      ],
      'plumbing': [
        "Licensed Plumbing Co", "Certified Plumbers", "Professional Plumbing", "Accredited Pipe Services",
        "Quality Plumbing Solutions", "Licensed Water Systems", "Certified Drain Services", "Professional Plumbers",
        "Reliable Plumbing Co", "Licensed Pipe Works", "Certified Water Services", "Professional Drainage",
        "Quality Pipe Solutions", "Licensed Plumbing Systems", "Certified Water Works", "Professional Pipe Co"
      ],
      default: [
        "Professional Services", "Licensed Business Co", "Certified Solutions", "Quality Service Group",
        "Accredited Business", "Professional Company", "Licensed Services", "Certified Business Group",
        "Quality Solutions Co", "Professional Group", "Licensed Company", "Certified Services",
        "Quality Business Group", "Professional Solutions", "Licensed Service Co", "Certified Company"
      ]
    };

    return industryNames[industry.toLowerCase()] || industryNames.default;
  }

  /**
   * Generates a realistic address for the ZIP code
   */
  private generateAddress(zip: string): string {
    const streets = [
      "Commerce Street", "Business Boulevard", "Professional Drive", "Corporate Avenue",
      "Enterprise Way", "Industrial Road", "Commercial Street", "Business Park Drive"
    ];
    
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const street = streets[Math.floor(Math.random() * streets.length)];
    
    return `${streetNumber} ${street}, ${zip}`;
  }

  /**
   * Generates a realistic phone number
   */
  private generatePhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 10000);
    
    return `(${areaCode}) ${exchange}-${number.toString().padStart(4, '0')}`;
  }

  /**
   * Generates a realistic website URL
   */
  private generateWebsite(businessName: string): string {
    const domain = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    
    const tlds = ['.com', '.net', '.biz'];
    const tld = tlds[Math.floor(Math.random() * tlds.length)];
    
    return `https://www.${domain}${tld}`;
  }

  /**
   * Estimates revenue based on industry type (BBB businesses tend to be more established)
   */
  private estimateRevenue(industry: string): number {
    const industryRanges: { [key: string]: { min: number; max: number } } = {
      restaurants: { min: 300000, max: 2500000 },
      'auto repair': { min: 250000, max: 2000000 },
      'hair salons': { min: 150000, max: 1000000 },
      plumbing: { min: 400000, max: 3500000 },
      default: { min: 200000, max: 1500000 }
    };

    const range = industryRanges[industry.toLowerCase()] || industryRanges.default;
    return Math.floor(Math.random() * (range.max - range.min) + range.min);
  }

  /**
   * Generates sample reviews (BBB reviews tend to focus on business practices)
   */
  private generateReviews(count: number): Review[] {
    const reviews: Review[] = [];
    const sampleTexts = [
      "Reliable and professional service. Good business practices.",
      "Fair pricing and transparent business dealings.",
      "Professional service but could improve communication.",
      "Excellent business ethics and quality work.",
      "Had some issues but management resolved them quickly.",
      "Trustworthy business with consistent quality.",
      "Professional service with clear contracts and pricing.",
      "Good business practices and reliable service.",
      "Some concerns about billing but overall satisfactory.",
      "Excellent customer service and professional approach."
    ];

    for (let i = 0; i < count; i++) {
      const rating = Math.floor(Math.random() * 3) + 3; // BBB reviews tend to be 3-5
      const review: Review = {
        id: `bbb_review_${i}`,
        rating,
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        date: new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000).toISOString(), // Up to 3 years ago
        source: 'bbb',
        sentiment: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
        chaosIndicators: {
          inconsistentPricing: Math.random() > 0.9, // BBB businesses tend to be more consistent
          serviceVolatility: Math.random() > 0.85,
          ownershipChanges: Math.random() > 0.95,
          qualityFluctuations: Math.random() > 0.8
        }
      };
      reviews.push(review);
    }

    return reviews;
  }

  /**
   * Gets scraping result summary
   */
  async getScrapingResult(
    zip: string,
    industry: string,
    maxResults: number
  ): Promise<ScrapingResult> {
    const businesses = await this.scrapeBusinesses(zip, industry, maxResults);
    
    return {
      businesses,
      totalFound: businesses.length,
      dataQuality: businesses.reduce((sum, b) => sum + b.dataQuality, 0) / businesses.length,
      source: 'bbb',
      timestamp: new Date().toISOString(),
      errors: []
    };
  }

  /**
   * Introduces delay between requests to respect rate limits
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}