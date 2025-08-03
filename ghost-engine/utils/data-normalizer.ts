import { v4 as uuidv4 } from 'uuid';

export interface NormalizedListing {
  id: string;
  source: string;
  name: string;
  industry: string;
  location: string;
  price: number | null;
  priceRange?: {
    min: number | null;
    max: number | null;
  };
  revenue?: number | null;
  description?: string;
  contactLink: string;
  tags: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  metadata: {
    scrapedAt: Date;
    originalData: any;
    confidence: number; // 0-1 score for data quality
  };
}

export interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  formatted: string;
}

export class DataNormalizer {
  private industryMappings: Map<string, string>;
  private locationCache: Map<string, LocationData>;

  constructor() {
    this.industryMappings = this.initializeIndustryMappings();
    this.locationCache = new Map();
  }

  public normalize(rawListings: any[], source: string): NormalizedListing[] {
    return rawListings
      .map(listing => this.normalizeSingleListing(listing, source))
      .filter(listing => listing !== null) as NormalizedListing[];
  }

  private normalizeSingleListing(rawListing: any, source: string): NormalizedListing | null {
    try {
      const id = uuidv4();
      
      // Normalize name/title
      const name = this.cleanText(rawListing.title || rawListing.name || '');
      if (!name) return null; // Skip if no name

      // Normalize industry
      const industry = this.normalizeIndustry(rawListing.industry || rawListing.category || '');

      // Normalize location
      const locationData = this.normalizeLocation(rawListing.location || '');

      // Normalize price
      const priceData = this.normalizePrice(rawListing.price || '');

      // Normalize description
      const description = this.cleanText(rawListing.description || '', 500);

      // Generate contact link
      const contactLink = this.normalizeContactLink(rawListing.link || '', source);

      // Generate tags
      const tags = this.generateTags(rawListing, industry);

      // Calculate confidence score
      const confidence = this.calculateConfidence(rawListing, name, locationData, priceData);

      return {
        id,
        source,
        name,
        industry,
        location: locationData.formatted,
        price: priceData.price,
        priceRange: priceData.range,
        revenue: this.extractRevenue(rawListing),
        description,
        contactLink,
        tags,
        coordinates: this.extractCoordinates(rawListing),
        metadata: {
          scrapedAt: new Date(),
          originalData: rawListing,
          confidence
        }
      };

    } catch (error) {
      console.error('Error normalizing listing:', error);
      return null;
    }
  }

  private cleanText(text: string, maxLength?: number): string {
    if (!text) return '';
    
    // Remove extra whitespace and normalize
    let cleaned = text.trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,!?()&]/g, '') // Remove special chars except basic punctuation
      .trim();

    // Truncate if needed
    if (maxLength && cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength).trim();
      // Try to break at word boundary
      const lastSpace = cleaned.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        cleaned = cleaned.substring(0, lastSpace);
      }
      cleaned += '...';
    }

    return cleaned;
  }

  private normalizeIndustry(rawIndustry: string): string {
    if (!rawIndustry) return 'Other';

    const cleaned = rawIndustry.toLowerCase().trim();
    
    // Check direct mappings first
    if (this.industryMappings.has(cleaned)) {
      return this.industryMappings.get(cleaned)!;
    }

    // Check partial matches
    for (const [key, value] of this.industryMappings.entries()) {
      if (cleaned.includes(key) || key.includes(cleaned)) {
        return value;
      }
    }

    // Capitalize first letter if no mapping found
    return rawIndustry.charAt(0).toUpperCase() + rawIndustry.slice(1).toLowerCase();
  }

  private normalizeLocation(rawLocation: string): LocationData {
    if (!rawLocation) return { formatted: 'Unknown' };

    const cleaned = this.cleanText(rawLocation);
    
    // Check cache first
    if (this.locationCache.has(cleaned)) {
      return this.locationCache.get(cleaned)!;
    }

    const locationData = this.parseLocation(cleaned);
    this.locationCache.set(cleaned, locationData);
    
    return locationData;
  }

  private parseLocation(location: string): LocationData {
    // Simple location parsing - could be enhanced with geocoding API
    const parts = location.split(',').map(p => p.trim());
    
    let city: string | undefined;
    let state: string | undefined;
    let country: string | undefined;
    let zipCode: string | undefined;

    if (parts.length >= 2) {
      city = parts[0];
      
      // Check if last part is a country
      const lastPart = parts[parts.length - 1];
      if (lastPart.toLowerCase() === 'usa' || lastPart.toLowerCase() === 'us' || 
          lastPart.toLowerCase() === 'united states') {
        country = 'United States';
        if (parts.length >= 3) {
          state = parts[parts.length - 2];
        }
      } else if (parts.length === 2) {
        state = parts[1];
        country = 'United States'; // Default assumption
      }
    }

    // Extract zip code pattern
    const zipMatch = location.match(/\b\d{5}(-\d{4})?\b/);
    if (zipMatch) {
      zipCode = zipMatch[0];
    }

    return {
      city,
      state,
      country: country || 'United States',
      zipCode,
      formatted: location
    };
  }

  private normalizePrice(rawPrice: string): { price: number | null; range?: { min: number | null; max: number | null } } {
    if (!rawPrice) return { price: null };

    // Remove currency symbols and normalize
    const cleaned = rawPrice.replace(/[$,]/g, '').trim();

    // Handle price ranges (e.g., "$100K - $500K", "100000-500000")
    const rangeMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)?\s*[-–—to]\s*(\d+(?:\.\d+)?)\s*(?:k|thousand)?/i);
    if (rangeMatch) {
      const min = this.parseNumericValue(rangeMatch[1]);
      const max = this.parseNumericValue(rangeMatch[2]);
      return {
        price: min, // Use minimum as primary price
        range: { min, max }
      };
    }

    // Handle single price
    const singlePrice = this.parseNumericValue(cleaned);
    return { price: singlePrice };
  }

  private parseNumericValue(value: string): number | null {
    if (!value) return null;

    // Handle K, M, B suffixes
    const multipliers: { [key: string]: number } = {
      'k': 1000,
      'thousand': 1000,
      'm': 1000000,
      'million': 1000000,
      'b': 1000000000,
      'billion': 1000000000
    };

    const numStr = value.toLowerCase().trim();
    
    for (const [suffix, multiplier] of Object.entries(multipliers)) {
      if (numStr.endsWith(suffix)) {
        const baseNum = parseFloat(numStr.replace(suffix, '').trim());
        if (!isNaN(baseNum)) {
          return baseNum * multiplier;
        }
      }
    }

    // Try direct parsing
    const directNum = parseFloat(numStr);
    return isNaN(directNum) ? null : directNum;
  }

  private extractRevenue(rawListing: any): number | null {
    // Look for revenue indicators in various fields
    const revenueFields = [
      rawListing.revenue,
      rawListing.annualRevenue,
      rawListing.sales,
      rawListing.income
    ];

    for (const field of revenueFields) {
      if (field) {
        const revenue = this.parseNumericValue(String(field));
        if (revenue) return revenue;
      }
    }

    return null;
  }

  private normalizeContactLink(rawLink: string, source: string): string {
    if (!rawLink) return '';

    // Make absolute URL if relative
    if (rawLink.startsWith('/')) {
      const sourceUrl = this.getSourceBaseUrl(source);
      return sourceUrl + rawLink;
    }

    // Ensure proper protocol
    if (!rawLink.startsWith('http')) {
      return 'https://' + rawLink;
    }

    return rawLink;
  }

  private getSourceBaseUrl(source: string): string {
    const baseUrls: { [key: string]: string } = {
      'bizbuysell': 'https://www.bizbuysell.com',
      'loopnet': 'https://www.loopnet.com',
      'flippa': 'https://flippa.com',
      'facebook': 'https://www.facebook.com',
      'nextdoor': 'https://nextdoor.com'
    };

    return baseUrls[source.toLowerCase()] || '';
  }

  private generateTags(rawListing: any, industry: string): string[] {
    const tags = new Set<string>();

    // Add industry as tag
    if (industry && industry !== 'Other') {
      tags.add(industry.toLowerCase());
    }

    // Extract tags from description
    if (rawListing.description) {
      const desc = rawListing.description.toLowerCase();
      
      // Common business keywords
      const keywords = [
        'franchise', 'established', 'profitable', 'turnkey', 'growing',
        'online', 'retail', 'restaurant', 'service', 'manufacturing',
        'technology', 'healthcare', 'real estate', 'automotive'
      ];

      keywords.forEach(keyword => {
        if (desc.includes(keyword)) {
          tags.add(keyword);
        }
      });
    }

    // Add source-specific tags
    if (rawListing.businessType) {
      tags.add(rawListing.businessType.toLowerCase());
    }

    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  private calculateConfidence(rawListing: any, name: string, location: LocationData, priceData: any): number {
    let score = 0;

    // Name quality (25%)
    if (name && name.length > 3) score += 0.25;

    // Location quality (25%)
    if (location.city && location.state) score += 0.25;
    else if (location.formatted !== 'Unknown') score += 0.15;

    // Price quality (25%)
    if (priceData.price !== null) score += 0.25;

    // Additional data quality (25%)
    let additionalScore = 0;
    if (rawListing.description && rawListing.description.length > 50) additionalScore += 0.1;
    if (rawListing.industry || rawListing.category) additionalScore += 0.05;
    if (rawListing.link) additionalScore += 0.1;
    
    score += Math.min(additionalScore, 0.25);

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  private extractCoordinates(rawListing: any): { lat: number; lng: number } | undefined {
    // Check if coordinates are already provided
    if (rawListing.lat && rawListing.lng) {
      return {
        lat: parseFloat(rawListing.lat),
        lng: parseFloat(rawListing.lng)
      };
    }

    if (rawListing.latitude && rawListing.longitude) {
      return {
        lat: parseFloat(rawListing.latitude),
        lng: parseFloat(rawListing.longitude)
      };
    }

    // Could implement geocoding here in the future
    return undefined;
  }

  private initializeIndustryMappings(): Map<string, string> {
    const mappings = new Map<string, string>();

    // Mapping raw industry terms to standardized categories
    const categories = {
      'Technology': [
        'tech', 'technology', 'software', 'app', 'web', 'digital', 'it',
        'saas', 'mobile', 'internet', 'computer', 'ai', 'data'
      ],
      'Food & Beverage': [
        'restaurant', 'food', 'cafe', 'bar', 'bakery', 'catering',
        'pizza', 'fast food', 'dining', 'beverage', 'coffee'
      ],
      'Retail': [
        'retail', 'store', 'shop', 'boutique', 'clothing', 'apparel',
        'merchandise', 'goods', 'sales'
      ],
      'Healthcare': [
        'healthcare', 'medical', 'dental', 'clinic', 'health',
        'pharmacy', 'wellness', 'fitness', 'beauty'
      ],
      'Real Estate': [
        'real estate', 'property', 'realty', 'land', 'commercial property',
        'residential', 'investment property'
      ],
      'Automotive': [
        'automotive', 'car', 'auto', 'vehicle', 'dealership',
        'repair', 'service station', 'garage'
      ],
      'Services': [
        'service', 'consulting', 'professional', 'cleaning',
        'maintenance', 'repair', 'home services'
      ],
      'Manufacturing': [
        'manufacturing', 'factory', 'production', 'industrial',
        'assembly', 'fabrication'
      ],
      'Education': [
        'education', 'school', 'training', 'learning', 'academy',
        'tutoring', 'childcare'
      ],
      'Entertainment': [
        'entertainment', 'leisure', 'recreation', 'gaming',
        'sports', 'tourism', 'travel'
      ]
    };

    // Build the mapping
    Object.entries(categories).forEach(([category, terms]) => {
      terms.forEach(term => {
        mappings.set(term.toLowerCase(), category);
      });
    });

    return mappings;
  }

  public getIndustryStats(listings: NormalizedListing[]): { [industry: string]: number } {
    const stats: { [industry: string]: number } = {};
    
    listings.forEach(listing => {
      stats[listing.industry] = (stats[listing.industry] || 0) + 1;
    });

    return stats;
  }

  public getLocationStats(listings: NormalizedListing[]): { [location: string]: number } {
    const stats: { [location: string]: number } = {};
    
    listings.forEach(listing => {
      const locationKey = listing.location;
      stats[locationKey] = (stats[locationKey] || 0) + 1;
    });

    return stats;
  }

  public deduplicateListings(listings: NormalizedListing[]): NormalizedListing[] {
    const seen = new Set<string>();
    const deduplicated: NormalizedListing[] = [];

    listings.forEach(listing => {
      // Create a hash based on name, location, and price
      const hash = this.createListingHash(listing);
      
      if (!seen.has(hash)) {
        seen.add(hash);
        deduplicated.push(listing);
      }
    });

    return deduplicated;
  }

  private createListingHash(listing: NormalizedListing): string {
    const key = `${listing.name.toLowerCase()}_${listing.location.toLowerCase()}_${listing.price || 'noPrice'}`;
    return key.replace(/\s+/g, '_');
  }
}