/**
 * Yelp Business Scraper
 * 
 * Scrapes business data from Yelp using their public directory
 * Note: In production, use Yelp Fusion API for better reliability
 */

import { BusinessData, Review, ScrapingResult } from '../../types/fragment-finder';

export class YelpScraper {
  private readonly baseUrl = 'https://www.yelp.com';
  private readonly requestDelay = 1000; // 1 second between requests

  constructor() {
    // Initialize scraper with rate limiting
  }

  /**
   * Scrapes businesses from Yelp for a given location and industry
   */
  async scrapeBusinesses(
    zip: string, 
    industry: string, 
    maxResults: number = 200
  ): Promise<BusinessData[]> {
    try {
      console.log(`Scraping Yelp for ${industry} businesses in ${zip}...`);
      
      // In a real implementation, this would make HTTP requests to Yelp
      // For demo purposes, we'll return simulated data
      return this.generateSimulatedYelpData(zip, industry, maxResults);
      
    } catch (error) {
      console.error('Error scraping Yelp:', error);
      return [];
    }
  }

  /**
   * Generates simulated Yelp data for demonstration
   * In production, replace with actual scraping logic
   */
  private generateSimulatedYelpData(
    zip: string, 
    industry: string, 
    maxResults: number
  ): BusinessData[] {
    const businesses: BusinessData[] = [];
    const businessNames = this.getIndustryBusinessNames(industry);
    
    for (let i = 0; i < Math.min(maxResults, businessNames.length); i++) {
      const business: BusinessData = {
        id: `yelp_${zip}_${i}`,
        name: businessNames[i],
        address: this.generateAddress(zip),
        phone: this.generatePhoneNumber(),
        website: Math.random() > 0.3 ? this.generateWebsite(businessNames[i]) : undefined,
        industry,
        zip,
        estimatedRevenue: this.estimateRevenue(industry),
        employees: Math.floor(Math.random() * 25) + 1,
        reviewCount: Math.floor(Math.random() * 200) + 5,
        averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
        reviews: this.generateReviews(Math.floor(Math.random() * 10) + 3),
        businessAge: Math.floor(Math.random() * 20) + 1,
        ownerAge: Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 45 : undefined,
        dataSource: 'yelp',
        dataQuality: Math.random() * 0.3 + 0.7, // 0.7-1.0
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
        "Luigi's Italian Kitchen", "Sakura Sushi Bar", "The Corner Diner", "Bella Vista Bistro",
        "Smokehouse BBQ", "Golden Dragon Chinese", "Taco Fiesta", "Riverside Cafe",
        "Mike's Steakhouse", "Green Garden Vegetarian", "Pizza Palace", "Ocean View Seafood",
        "Country Kitchen", "Spice Route Indian", "Le Petit French", "Burger Junction",
        "Mama Rosa's", "Thai Orchid", "The Breakfast Club", "Mediterranean Delights"
      ],
      'auto repair': [
        "Quick Fix Auto", "Bob's Garage", "Elite Auto Service", "Precision Motors",
        "City Auto Repair", "Express Lube & Tune", "Master Mechanics", "Auto Care Plus",
        "Reliable Auto Works", "Premium Auto Service", "Downtown Garage", "Swift Repairs",
        "Professional Auto", "Complete Car Care", "Auto Excellence", "Speedy Service",
        "Quality Auto Repair", "Trusty Motors", "Advanced Auto", "Expert Auto Care"
      ],
      'hair salons': [
        "Style Studio", "Glamour Hair Salon", "Cutting Edge", "Beautiful You Salon",
        "Trendy Cuts", "Hair Artistry", "The Salon Experience", "Chic Hair Design",
        "Modern Hair Studio", "Hair & Beauty Co", "Elegance Salon", "Hair Boutique",
        "Style Central", "Hair Creations", "The Hair Loft", "Salon Mystique",
        "Hair Gallery", "Beauty Bar Salon", "Hair Innovations", "Classic Cuts"
      ],
      'plumbing': [
        "Reliable Plumbing Co", "Quick Flow Plumbers", "Master Pipe Services", "Drain Masters",
        "Pro Plumbing Solutions", "Water Works Plumbing", "Emergency Plumbers", "Pipe Dreams",
        "Flowing Solutions", "Professional Plumbers", "Leak Busters", "Pipe Pros",
        "Water Line Experts", "Drainage Solutions", "Plumbing Perfection", "Swift Plumbers",
        "Complete Plumbing", "Quality Pipe Works", "Water System Pros", "Expert Plumbing"
      ],
      default: [
        "Local Business 1", "Main Street Company", "Community Services", "Neighborhood Store",
        "Downtown Business", "City Services", "Professional Solutions", "Quality Service Co",
        "Expert Services", "Reliable Business", "Premier Company", "Excellence Corp",
        "Superior Services", "Professional Group", "Quality Solutions", "Expert Corp",
        "Reliable Services", "Premier Solutions", "Professional Co", "Excellence Group"
      ]
    };

    return industryNames[industry.toLowerCase()] || industryNames.default;
  }

  /**
   * Generates a realistic address for the ZIP code
   */
  private generateAddress(zip: string): string {
    const streets = [
      "Main St", "Oak Ave", "Pine St", "First Ave", "Second St", "Park Blvd",
      "Washington St", "Lincoln Ave", "Broadway", "Center St", "Church St", "Market St"
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
      .substring(0, 15);
    
    const tlds = ['.com', '.net', '.biz', '.co'];
    const tld = tlds[Math.floor(Math.random() * tlds.length)];
    
    return `https://www.${domain}${tld}`;
  }

  /**
   * Estimates revenue based on industry type
   */
  private estimateRevenue(industry: string): number {
    const industryRanges: { [key: string]: { min: number; max: number } } = {
      restaurants: { min: 200000, max: 2000000 },
      'auto repair': { min: 150000, max: 1500000 },
      'hair salons': { min: 100000, max: 800000 },
      plumbing: { min: 250000, max: 2500000 },
      default: { min: 100000, max: 1000000 }
    };

    const range = industryRanges[industry.toLowerCase()] || industryRanges.default;
    return Math.floor(Math.random() * (range.max - range.min) + range.min);
  }

  /**
   * Generates sample reviews
   */
  private generateReviews(count: number): Review[] {
    const reviews: Review[] = [];
    const sampleTexts = [
      "Great service and friendly staff!",
      "Good quality but a bit pricey",
      "Average experience, nothing special",
      "Excellent work, highly recommend",
      "Poor service, would not return",
      "Outstanding quality and value",
      "Decent service, fair prices",
      "Exceptional customer service",
      "Disappointing experience overall",
      "Top-notch quality and professionalism"
    ];

    for (let i = 0; i < count; i++) {
      const rating = Math.floor(Math.random() * 5) + 1;
      const review: Review = {
        id: `review_${i}`,
        rating,
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'yelp',
        sentiment: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
        chaosIndicators: {
          inconsistentPricing: Math.random() > 0.8,
          serviceVolatility: Math.random() > 0.85,
          ownershipChanges: Math.random() > 0.95,
          qualityFluctuations: Math.random() > 0.7
        }
      };
      reviews.push(review);
    }

    return reviews;
  }

  /**
   * Validates scraped business data
   */
  private validateBusinessData(business: BusinessData): boolean {
    return !!(
      business.name &&
      business.address &&
      business.industry &&
      business.zip
    );
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
      source: 'yelp',
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