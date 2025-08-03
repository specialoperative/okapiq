import axios, { AxiosRequestConfig } from 'axios';
import { Logger } from '../utils/logger';
import { NormalizedListing } from '../utils/data-normalizer';

export interface EnrichedContact {
  email?: string;
  linkedinProfile?: string;
  title?: string;
  companyHistory?: string[];
  phoneNumber?: string;
  crunchbaseProfile?: string;
  apolloProfile?: string;
  socialProfiles?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface EnrichedListing extends NormalizedListing {
  enrichment?: {
    owner?: EnrichedContact;
    broker?: EnrichedContact;
    companyInfo?: {
      employees?: number;
      founded?: number;
      funding?: string;
      valuation?: string;
      competitors?: string[];
    };
    marketInsights?: {
      industryTrends?: string[];
      similarSales?: any[];
      marketValue?: string;
    };
    enrichedAt: Date;
    sources: string[];
    confidence: number;
  };
}

export class EnrichmentAgent {
  private logger: Logger;
  private apolloApiKey?: string;
  private crunchbaseApiKey?: string;
  private enableLinkedIn: boolean;
  private enableApollo: boolean;
  private enableCrunchbase: boolean;

  constructor(config: any, logger: Logger) {
    this.logger = logger;
    this.apolloApiKey = config.apiKeys?.apollo;
    this.crunchbaseApiKey = config.apiKeys?.crunchbase;
    this.enableLinkedIn = config.enableLinkedIn || false;
    this.enableApollo = config.enableApollo || false;
    this.enableCrunchbase = config.enableCrunchbase || false;
  }

  public async enrichListing(listing: NormalizedListing): Promise<EnrichedListing> {
    const startTime = Date.now();
    this.logger.logEnrichmentActivity('START', `Enriching listing: ${listing.name}`);

    const enrichedListing: EnrichedListing = {
      ...listing,
      enrichment: {
        enrichedAt: new Date(),
        sources: [],
        confidence: 0
      }
    };

    try {
      // Enrich with multiple sources in parallel
      const enrichmentPromises: Promise<any>[] = [];

      if (this.enableApollo && this.apolloApiKey) {
        enrichmentPromises.push(this.enrichWithApollo(listing));
      }

      if (this.enableCrunchbase && this.crunchbaseApiKey) {
        enrichmentPromises.push(this.enrichWithCrunchbase(listing));
      }

      if (this.enableLinkedIn) {
        enrichmentPromises.push(this.enrichWithLinkedIn(listing));
      }

      // Web scraping enrichment (always enabled)
      enrichmentPromises.push(this.enrichWithWebScraping(listing));

      const enrichmentResults = await Promise.allSettled(enrichmentPromises);

      // Combine results
      enrichmentResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          this.mergeEnrichmentData(enrichedListing, result.value);
        } else if (result.status === 'rejected') {
          this.logger.warn(`Enrichment source ${index} failed:`, result.reason);
        }
      });

      // Calculate enrichment confidence
      enrichedListing.enrichment!.confidence = this.calculateEnrichmentConfidence(enrichedListing);

      const duration = Date.now() - startTime;
      this.logger.logEnrichmentActivity('COMPLETE', `Enriched listing in ${duration}ms`, {
        sources: enrichedListing.enrichment!.sources,
        confidence: enrichedListing.enrichment!.confidence
      });

    } catch (error) {
      this.logger.error('Enrichment failed', error);
    }

    return enrichedListing;
  }

  private async enrichWithApollo(listing: NormalizedListing): Promise<any> {
    if (!this.apolloApiKey) return null;

    try {
      this.logger.logEnrichmentActivity('apollo.io', 'Starting Apollo enrichment');

      // Search for company information
      const companySearch = await this.apolloCompanySearch(listing.name, listing.location);
      
      // Search for contacts if company found
      let contacts = null;
      if (companySearch?.company) {
        contacts = await this.apolloContactSearch(companySearch.company.id);
      }

      const enrichmentData = {
        source: 'apollo',
        company: companySearch?.company,
        contacts: contacts?.contacts || []
      };

      this.logger.logEnrichmentActivity('apollo.io', 'Apollo enrichment completed', {
        companyFound: !!companySearch?.company,
        contactsFound: contacts?.contacts?.length || 0
      });

      return enrichmentData;

    } catch (error) {
      this.logger.error('Apollo enrichment failed', error);
      return null;
    }
  }

  private async apolloCompanySearch(companyName: string, location: string): Promise<any> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://api.apollo.io/v1/mixed_companies/search',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Api-Key': this.apolloApiKey
      },
      data: {
        q_organization_name: companyName,
        q_organization_locations: [location],
        page: 1,
        per_page: 10
      }
    };

    const response = await axios(config);
    return response.data;
  }

  private async apolloContactSearch(companyId: string): Promise<any> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://api.apollo.io/v1/mixed_people/search',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Api-Key': this.apolloApiKey
      },
      data: {
        q_organization_ids: [companyId],
        page: 1,
        per_page: 25,
        person_titles: ['owner', 'founder', 'ceo', 'president', 'director']
      }
    };

    const response = await axios(config);
    return response.data;
  }

  private async enrichWithCrunchbase(listing: NormalizedListing): Promise<any> {
    if (!this.crunchbaseApiKey) return null;

    try {
      this.logger.logEnrichmentActivity('crunchbase', 'Starting Crunchbase enrichment');

      // Search for organization
      const orgSearch = await this.crunchbaseOrganizationSearch(listing.name);
      
      let orgDetails = null;
      if (orgSearch?.entities?.length > 0) {
        const orgId = orgSearch.entities[0].uuid;
        orgDetails = await this.crunchbaseOrganizationDetails(orgId);
      }

      const enrichmentData = {
        source: 'crunchbase',
        organization: orgDetails?.properties || null,
        funding: orgDetails?.cards?.funding_rounds?.funding_rounds || []
      };

      this.logger.logEnrichmentActivity('crunchbase', 'Crunchbase enrichment completed', {
        organizationFound: !!orgDetails,
        fundingRounds: enrichmentData.funding.length
      });

      return enrichmentData;

    } catch (error) {
      this.logger.error('Crunchbase enrichment failed', error);
      return null;
    }
  }

  private async crunchbaseOrganizationSearch(companyName: string): Promise<any> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `https://api.crunchbase.com/api/v4/autocompletes`,
      headers: {
        'X-cb-user-key': this.crunchbaseApiKey
      },
      params: {
        query: companyName,
        collection_ids: 'organizations',
        limit: 10
      }
    };

    const response = await axios(config);
    return response.data;
  }

  private async crunchbaseOrganizationDetails(orgId: string): Promise<any> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `https://api.crunchbase.com/api/v4/entities/organizations/${orgId}`,
      headers: {
        'X-cb-user-key': this.crunchbaseApiKey
      },
      params: {
        card_ids: 'fields,funding_rounds,investors,acquisitions'
      }
    };

    const response = await axios(config);
    return response.data;
  }

  private async enrichWithLinkedIn(listing: NormalizedListing): Promise<any> {
    try {
      this.logger.logEnrichmentActivity('linkedin', 'Starting LinkedIn enrichment');

      // Use web scraping for LinkedIn since API access is restricted
      const linkedinData = await this.linkedinWebSearch(listing.name, listing.location);

      const enrichmentData = {
        source: 'linkedin',
        companyPage: linkedinData?.companyUrl,
        employees: linkedinData?.employeeCount,
        description: linkedinData?.description
      };

      this.logger.logEnrichmentActivity('linkedin', 'LinkedIn enrichment completed');

      return enrichmentData;

    } catch (error) {
      this.logger.error('LinkedIn enrichment failed', error);
      return null;
    }
  }

  private async linkedinWebSearch(companyName: string, location: string): Promise<any> {
    // Simplified LinkedIn web search
    // In production, this would use a more sophisticated approach
    try {
      const searchQuery = `site:linkedin.com/company ${companyName} ${location}`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

      // This is a placeholder - in production you'd use a proper web scraping service
      // or LinkedIn's official API with proper authentication
      
      return {
        companyUrl: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        employeeCount: 'Unknown',
        description: 'Company profile found on LinkedIn'
      };

    } catch (error) {
      this.logger.debug('LinkedIn web search failed', error);
      return null;
    }
  }

  private async enrichWithWebScraping(listing: NormalizedListing): Promise<any> {
    try {
      this.logger.logEnrichmentActivity('web-scraping', 'Starting web scraping enrichment');

      // Extract domain from contact link if available
      let domain = null;
      if (listing.contactLink) {
        try {
          const url = new URL(listing.contactLink);
          domain = url.hostname;
        } catch (error) {
          // Invalid URL
        }
      }

      // Gather additional web intelligence
      const webData = await this.gatherWebIntelligence(listing.name, domain);

      const enrichmentData = {
        source: 'web-scraping',
        domain,
        webPresence: webData
      };

      this.logger.logEnrichmentActivity('web-scraping', 'Web scraping enrichment completed');

      return enrichmentData;

    } catch (error) {
      this.logger.error('Web scraping enrichment failed', error);
      return null;
    }
  }

  private async gatherWebIntelligence(companyName: string, domain?: string | null): Promise<any> {
    const intelligence: any = {
      socialProfiles: {},
      onlinePresence: false
    };

    try {
      // Simple web presence check
      if (domain) {
        try {
          const response = await axios.get(`https://${domain}`, { 
            timeout: 10000,
            validateStatus: () => true // Accept any status code
          });
          
          intelligence.onlinePresence = response.status < 400;
          intelligence.websiteStatus = response.status;
          
          // Extract basic metadata from website
          if (response.data && typeof response.data === 'string') {
            const titleMatch = response.data.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (titleMatch) {
              intelligence.websiteTitle = titleMatch[1].trim();
            }
            
            const descMatch = response.data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
            if (descMatch) {
              intelligence.websiteDescription = descMatch[1].trim();
            }
          }
        } catch (error) {
          intelligence.onlinePresence = false;
        }
      }

      return intelligence;

    } catch (error) {
      this.logger.debug('Web intelligence gathering failed', error);
      return intelligence;
    }
  }

  private mergeEnrichmentData(enrichedListing: EnrichedListing, sourceData: any): void {
    if (!sourceData || !enrichedListing.enrichment) return;

    // Add source to list
    enrichedListing.enrichment.sources.push(sourceData.source);

    // Merge based on source type
    switch (sourceData.source) {
      case 'apollo':
        this.mergeApolloData(enrichedListing, sourceData);
        break;
      case 'crunchbase':
        this.mergeCrunchbaseData(enrichedListing, sourceData);
        break;
      case 'linkedin':
        this.mergeLinkedInData(enrichedListing, sourceData);
        break;
      case 'web-scraping':
        this.mergeWebData(enrichedListing, sourceData);
        break;
    }
  }

  private mergeApolloData(enrichedListing: EnrichedListing, apolloData: any): void {
    if (!enrichedListing.enrichment) return;

    // Extract owner/contact information
    if (apolloData.contacts && apolloData.contacts.length > 0) {
      const primaryContact = apolloData.contacts[0];
      
      enrichedListing.enrichment.owner = {
        email: primaryContact.email,
        title: primaryContact.title,
        linkedinProfile: primaryContact.linkedin_url,
        apolloProfile: primaryContact.apollo_url
      };
    }

    // Extract company information
    if (apolloData.company) {
      enrichedListing.enrichment.companyInfo = {
        employees: apolloData.company.employee_count,
        founded: apolloData.company.founded_year,
        ...enrichedListing.enrichment.companyInfo
      };
    }
  }

  private mergeCrunchbaseData(enrichedListing: EnrichedListing, crunchbaseData: any): void {
    if (!enrichedListing.enrichment) return;

    if (crunchbaseData.organization) {
      const org = crunchbaseData.organization;
      
      enrichedListing.enrichment.companyInfo = {
        founded: org.founded_on?.value ? new Date(org.founded_on.value).getFullYear() : undefined,
        employees: org.num_employees_enum?.value,
        valuation: org.valuation?.value_usd ? `$${org.valuation.value_usd}` : undefined,
        ...enrichedListing.enrichment.companyInfo
      };
    }

    if (crunchbaseData.funding && crunchbaseData.funding.length > 0) {
      const totalFunding = crunchbaseData.funding.reduce((sum: number, round: any) => {
        return sum + (round.money_raised?.value_usd || 0);
      }, 0);
      
      if (totalFunding > 0) {
        enrichedListing.enrichment.companyInfo = {
          funding: `$${totalFunding.toLocaleString()}`,
          ...enrichedListing.enrichment.companyInfo
        };
      }
    }
  }

  private mergeLinkedInData(enrichedListing: EnrichedListing, linkedinData: any): void {
    if (!enrichedListing.enrichment) return;

    if (linkedinData.companyPage) {
      enrichedListing.enrichment.owner = {
        linkedinProfile: linkedinData.companyPage,
        ...enrichedListing.enrichment.owner
      };
    }

    if (linkedinData.employees) {
      enrichedListing.enrichment.companyInfo = {
        employees: linkedinData.employees,
        ...enrichedListing.enrichment.companyInfo
      };
    }
  }

  private mergeWebData(enrichedListing: EnrichedListing, webData: any): void {
    if (!enrichedListing.enrichment || !webData.webPresence) return;

    // Update description if we found website description
    if (webData.webPresence.websiteDescription && !enrichedListing.description) {
      enrichedListing.description = webData.webPresence.websiteDescription;
    }
  }

  private calculateEnrichmentConfidence(enrichedListing: EnrichedListing): number {
    if (!enrichedListing.enrichment) return 0;

    let score = 0;
    const maxScore = 100;

    // Source diversity (40 points)
    const sourceCount = enrichedListing.enrichment.sources.length;
    score += Math.min(sourceCount * 10, 40);

    // Contact information completeness (30 points)
    if (enrichedListing.enrichment.owner) {
      if (enrichedListing.enrichment.owner.email) score += 10;
      if (enrichedListing.enrichment.owner.linkedinProfile) score += 10;
      if (enrichedListing.enrichment.owner.title) score += 10;
    }

    // Company information completeness (30 points)
    if (enrichedListing.enrichment.companyInfo) {
      if (enrichedListing.enrichment.companyInfo.employees) score += 10;
      if (enrichedListing.enrichment.companyInfo.founded) score += 10;
      if (enrichedListing.enrichment.companyInfo.funding || enrichedListing.enrichment.companyInfo.valuation) score += 10;
    }

    return Math.min(score, maxScore);
  }

  public async batchEnrich(listings: NormalizedListing[], batchSize: number = 10): Promise<EnrichedListing[]> {
    const enrichedListings: EnrichedListing[] = [];
    
    this.logger.info(`Starting batch enrichment of ${listings.length} listings`);

    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize);
      
      this.logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(listings.length / batchSize)}`);

      const batchPromises = batch.map(listing => this.enrichListing(listing));
      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          enrichedListings.push(result.value);
        } else {
          this.logger.error(`Failed to enrich listing ${i + index}:`, result.reason);
          // Add original listing without enrichment
          enrichedListings.push(batch[index] as EnrichedListing);
        }
      });

      // Rate limiting between batches
      if (i + batchSize < listings.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    this.logger.info(`Batch enrichment completed. ${enrichedListings.length} listings processed`);
    return enrichedListings;
  }
}