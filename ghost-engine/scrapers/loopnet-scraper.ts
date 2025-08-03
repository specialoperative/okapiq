import { Page } from 'puppeteer';
import { ScraperLogger } from '../utils/logger';
import { ScraperConfig } from '../config/config';

export interface LoopNetSearchParams {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  listingType?: 'for-sale' | 'for-lease';
}

export class LoopNetScraper {
  private logger: ScraperLogger;
  private config: ScraperConfig;

  constructor(logger: ScraperLogger, config: ScraperConfig) {
    this.logger = logger;
    this.config = config;
  }

  public async scrape(page: Page, searchParams?: LoopNetSearchParams): Promise<any[]> {
    const listings: any[] = [];

    try {
      const searchUrl = this.buildSearchUrl(searchParams);
      this.logger.logPageVisit(searchUrl, 'success');

      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Handle cookie consent and modals
      await this.handleInitialModals(page);

      // Wait for property listings to load
      await this.waitForPropertyListings(page);

      // Extract listings from current page
      const currentPageListings = await this.extractPropertyListings(page);
      listings.push(...currentPageListings);

      // Handle pagination for multiple pages
      if (this.config.pagination) {
        const paginatedListings = await this.handlePagination(page);
        listings.push(...paginatedListings);
      }

      this.logger.logListingsFound(listings.length);
      return listings;

    } catch (error) {
      this.logger.error('LoopNet scraping failed', error);
      throw error;
    }
  }

  private buildSearchUrl(params?: LoopNetSearchParams): string {
    let baseUrl = 'https://www.loopnet.com/search/commercial-real-estate';
    
    if (!params) return baseUrl;

    const searchParams = new URLSearchParams();

    if (params.location) {
      searchParams.append('sk', params.location);
    }

    if (params.propertyType) {
      searchParams.append('pt', params.propertyType);
    }

    if (params.listingType) {
      if (params.listingType === 'for-sale') {
        baseUrl = 'https://www.loopnet.com/search/commercial-real-estate-for-sale';
      } else if (params.listingType === 'for-lease') {
        baseUrl = 'https://www.loopnet.com/search/commercial-real-estate-for-lease';
      }
    }

    if (params.minPrice) {
      searchParams.append('bb', params.minPrice.toString());
    }

    if (params.maxPrice) {
      searchParams.append('bt', params.maxPrice.toString());
    }

    if (params.minSize) {
      searchParams.append('sbb', params.minSize.toString());
    }

    if (params.maxSize) {
      searchParams.append('sbt', params.maxSize.toString());
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  private async handleInitialModals(page: Page): Promise<void> {
    try {
      // Handle cookie consent
      const cookieAccept = await page.$('#onetrust-accept-btn-handler, .cookie-accept, [data-testid="accept-cookies"]');
      if (cookieAccept) {
        await cookieAccept.click();
        await this.randomDelay(1000, 2000);
        this.logger.info('Accepted cookie consent');
      }

      // Handle newsletter/registration modals
      const modalClose = await page.$('.modal-close, .close-modal, [aria-label="Close"], .popup-close');
      if (modalClose) {
        await modalClose.click();
        await this.randomDelay(1000, 2000);
        this.logger.info('Closed modal dialog');
      }

      // Handle location access requests
      const locationDeny = await page.$('.location-deny, .deny-location, [data-testid="deny-location"]');
      if (locationDeny) {
        await locationDeny.click();
        await this.randomDelay(1000, 2000);
      }

    } catch (error) {
      this.logger.debug('No initial modals found');
    }
  }

  private async waitForPropertyListings(page: Page): Promise<void> {
    try {
      const listingSelectors = [
        '.property-card',
        '.listing-result',
        '.search-result-item',
        '.property-listing',
        '[data-testid="property-card"]',
        '.result-card'
      ];

      let loaded = false;
      for (const selector of listingSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 15000 });
          loaded = true;
          this.logger.debug(`Property listings loaded with selector: ${selector}`);
          break;
        } catch (error) {
          // Try next selector
        }
      }

      if (!loaded) {
        this.logger.warn('No property listings found with standard selectors');
      }

      // Wait for dynamic content and images to load
      await this.randomDelay(3000, 5000);

    } catch (error) {
      this.logger.warn('Failed to wait for property listings', error);
    }
  }

  private async extractPropertyListings(page: Page): Promise<any[]> {
    try {
      const listings = await page.evaluate(() => {
        const results: any[] = [];
        
        const containerSelectors = [
          '.property-card',
          '.listing-result',
          '.search-result-item',
          '.property-listing',
          '[data-testid="property-card"]',
          '.result-card',
          '.property-item'
        ];

        let containers: NodeListOf<Element> | null = null;
        
        for (const selector of containerSelectors) {
          containers = document.querySelectorAll(selector);
          if (containers.length > 0) break;
        }

        if (!containers || containers.length === 0) {
          console.log('No property listing containers found');
          return results;
        }

        containers.forEach((container, index) => {
          try {
            // Extract property name/title
            const titleSelectors = [
              '.property-title',
              '.listing-title',
              '.property-name',
              'h3 a',
              'h2 a',
              '.title a',
              '.name'
            ];
            
            let title = '';
            for (const selector of titleSelectors) {
              const titleEl = container.querySelector(selector);
              if (titleEl?.textContent?.trim()) {
                title = titleEl.textContent.trim();
                break;
              }
            }

            // Extract price (sale or lease)
            const priceSelectors = [
              '.price',
              '.asking-price',
              '.sale-price',
              '.lease-rate',
              '.rent-price',
              '[data-testid="price"]',
              '.pricing'
            ];
            
            let price = '';
            for (const selector of priceSelectors) {
              const priceEl = container.querySelector(selector);
              if (priceEl?.textContent?.trim()) {
                price = priceEl.textContent.trim();
                break;
              }
            }

            // Extract location/address
            const locationSelectors = [
              '.address',
              '.location',
              '.property-address',
              '.city-state',
              '[data-testid="address"]',
              '.property-location'
            ];
            
            let location = '';
            for (const selector of locationSelectors) {
              const locationEl = container.querySelector(selector);
              if (locationEl?.textContent?.trim()) {
                location = locationEl.textContent.trim();
                break;
              }
            }

            // Extract property type
            const typeSelectors = [
              '.property-type',
              '.asset-type',
              '.category',
              '.listing-type',
              '[data-testid="property-type"]'
            ];
            
            let propertyType = '';
            for (const selector of typeSelectors) {
              const typeEl = container.querySelector(selector);
              if (typeEl?.textContent?.trim()) {
                propertyType = typeEl.textContent.trim();
                break;
              }
            }

            // Extract size/square footage
            const sizeSelectors = [
              '.square-feet',
              '.size',
              '.sqft',
              '.property-size',
              '[data-testid="size"]'
            ];
            
            let size = '';
            for (const selector of sizeSelectors) {
              const sizeEl = container.querySelector(selector);
              if (sizeEl?.textContent?.trim()) {
                size = sizeEl.textContent.trim();
                break;
              }
            }

            // Extract description
            const descSelectors = [
              '.description',
              '.property-description',
              '.summary',
              '.details'
            ];
            
            let description = '';
            for (const selector of descSelectors) {
              const descEl = container.querySelector(selector);
              if (descEl?.textContent?.trim()) {
                description = descEl.textContent.trim().substring(0, 250);
                break;
              }
            }

            // Extract link
            const linkSelectors = [
              'a[href*="/listing/"]',
              '.property-link',
              '.listing-link',
              'h3 a',
              'h2 a'
            ];
            
            let link = '';
            for (const selector of linkSelectors) {
              const linkEl = container.querySelector(selector);
              if (linkEl?.getAttribute('href')) {
                link = linkEl.getAttribute('href') || '';
                break;
              }
            }

            // Extract additional commercial property data
            const yearBuilt = container.querySelector('.year-built, .built-year')?.textContent?.trim() || '';
            const parking = container.querySelector('.parking, .parking-spaces')?.textContent?.trim() || '';
            const zoning = container.querySelector('.zoning, .zone')?.textContent?.trim() || '';
            const lotSize = container.querySelector('.lot-size, .land-size')?.textContent?.trim() || '';

            // Only add if we have minimum required data
            if (title && (price || location)) {
              results.push({
                title,
                price,
                location,
                industry: propertyType || 'Real Estate',
                description,
                link,
                size,
                propertyType,
                yearBuilt,
                parking,
                zoning,
                lotSize,
                source: 'loopnet',
                scrapedIndex: index
              });
            }

          } catch (error) {
            console.error(`Error extracting property listing ${index}:`, error);
          }
        });

        return results;
      });

      this.logger.logDataExtracted(listings.slice(0, 3));
      return listings;

    } catch (error) {
      this.logger.error('Failed to extract property listings', error);
      return [];
    }
  }

  private async handlePagination(page: Page): Promise<any[]> {
    const allListings: any[] = [];
    let currentPage = 1;
    const maxPages = this.config.pagination?.maxPages || 15;

    try {
      while (currentPage < maxPages) {
        const nextSelectors = [
          '.pagination-next',
          '.next-page',
          'a[aria-label*="Next"]',
          '.pager-next',
          '.next',
          '[data-testid="next-page"]'
        ];

        let nextButton = null;
        for (const selector of nextSelectors) {
          nextButton = await page.$(selector);
          if (nextButton) break;
        }

        if (!nextButton) {
          this.logger.info(`No next page button found at page ${currentPage}`);
          break;
        }

        // Check if button is disabled
        const isDisabled = await page.evaluate((btn) => {
          return btn.hasAttribute('disabled') || 
                 btn.classList.contains('disabled') ||
                 btn.getAttribute('aria-disabled') === 'true';
        }, nextButton);

        if (isDisabled) {
          this.logger.info(`Next button disabled at page ${currentPage}`);
          break;
        }

        // Human-like behavior before clicking
        await this.randomDelay(4000, 7000);
        
        // Scroll to button
        await page.evaluate((btn) => {
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, nextButton);

        await this.randomDelay(1500, 2500);

        // Click next page
        await nextButton.click();
        
        // Wait for navigation
        try {
          await page.waitForNavigation({ 
            waitUntil: 'networkidle2', 
            timeout: 30000 
          });
        } catch (error) {
          await this.randomDelay(4000, 6000);
        }

        currentPage++;
        this.logger.info(`Navigated to page ${currentPage}`);

        // Wait for new listings
        await this.waitForPropertyListings(page);

        // Extract from this page
        const pageListings = await this.extractPropertyListings(page);
        allListings.push(...pageListings);

        if (pageListings.length === 0) {
          this.logger.info(`No listings found on page ${currentPage}, stopping`);
          break;
        }

        // Safety limit
        if (currentPage > 30) {
          this.logger.warn('Reached safety limit for pagination');
          break;
        }
      }
    } catch (error) {
      this.logger.error('LoopNet pagination failed', error);
    }

    return allListings;
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  public static getDefaultSearchParams(): LoopNetSearchParams {
    return {
      listingType: 'for-sale',
      minPrice: 100000,
      maxPrice: 10000000
    };
  }

  public static getPropertyTypes(): string[] {
    return [
      'office',
      'retail',
      'industrial',
      'multifamily',
      'hotel',
      'healthcare',
      'self-storage',
      'specialty',
      'land',
      'mixed-use'
    ];
  }
}