import { Page } from 'puppeteer';
import { ScraperLogger } from '../utils/logger';
import { ScraperConfig } from '../config/config';

export interface BizBuySellSearchParams {
  location?: string;
  industry?: string;
  priceMin?: number;
  priceMax?: number;
  cashFlow?: string;
  revenue?: string;
  established?: number;
}

export class BizBuySellScraper {
  private logger: ScraperLogger;
  private config: ScraperConfig;

  constructor(logger: ScraperLogger, config: ScraperConfig) {
    this.logger = logger;
    this.config = config;
  }

  public async scrape(page: Page, searchParams?: BizBuySellSearchParams): Promise<any[]> {
    const listings: any[] = [];

    try {
      // Navigate to BizBuySell with search parameters
      const searchUrl = this.buildSearchUrl(searchParams);
      this.logger.logPageVisit(searchUrl, 'success');

      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Handle cookie consent if present
      await this.handleCookieConsent(page);

      // Wait for listings to load
      await this.waitForListings(page);

      // Extract listings from current page
      const currentPageListings = await this.extractListings(page);
      listings.push(...currentPageListings);

      // Handle pagination
      if (this.config.pagination) {
        const paginatedListings = await this.handlePagination(page);
        listings.push(...paginatedListings);
      }

      this.logger.logListingsFound(listings.length);
      return listings;

    } catch (error) {
      this.logger.error('BizBuySell scraping failed', error);
      throw error;
    }
  }

  private buildSearchUrl(params?: BizBuySellSearchParams): string {
    let baseUrl = 'https://www.bizbuysell.com/businesses-for-sale';
    
    if (!params) return baseUrl;

    const searchParams = new URLSearchParams();

    if (params.location) {
      searchParams.append('q', params.location);
    }

    if (params.industry) {
      searchParams.append('industry', params.industry);
    }

    if (params.priceMin) {
      searchParams.append('price_min', params.priceMin.toString());
    }

    if (params.priceMax) {
      searchParams.append('price_max', params.priceMax.toString());
    }

    if (params.cashFlow) {
      searchParams.append('cash_flow', params.cashFlow);
    }

    if (params.revenue) {
      searchParams.append('gross_revenue', params.revenue);
    }

    if (params.established) {
      searchParams.append('year_established', params.established.toString());
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  private async handleCookieConsent(page: Page): Promise<void> {
    try {
      // Common cookie consent selectors for BizBuySell
      const cookieSelectors = [
        '#cookie-consent-accept',
        '.cookie-accept',
        '[data-testid="accept-cookies"]',
        'button[aria-label*="Accept"]',
        'button:contains("Accept")',
        '.gdpr-accept'
      ];

      for (const selector of cookieSelectors) {
        try {
          const cookieButton = await page.$(selector);
          if (cookieButton) {
            await cookieButton.click();
            await this.randomDelay(1000, 2000);
            this.logger.info('Accepted cookie consent');
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
    } catch (error) {
      this.logger.debug('No cookie consent dialog found');
    }
  }

  private async waitForListings(page: Page): Promise<void> {
    try {
      // Wait for multiple possible selectors
      const listingSelectors = [
        '.listing-card',
        '.business-listing',
        '.search-result',
        '[data-testid="listing"]',
        '.listing-item'
      ];

      let loaded = false;
      for (const selector of listingSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 10000 });
          loaded = true;
          this.logger.debug(`Listings loaded with selector: ${selector}`);
          break;
        } catch (error) {
          // Try next selector
        }
      }

      if (!loaded) {
        this.logger.warn('No listings found with standard selectors');
      }

      // Additional wait for dynamic content
      await this.randomDelay(2000, 4000);

    } catch (error) {
      this.logger.warn('Failed to wait for listings', error);
    }
  }

  private async extractListings(page: Page): Promise<any[]> {
    try {
      const listings = await page.evaluate(() => {
        const results: any[] = [];
        
        // Multiple selector strategies for different page layouts
        const containerSelectors = [
          '.listing-card',
          '.business-listing', 
          '.search-result',
          '[data-testid="listing"]',
          '.listing-item',
          '.result-item'
        ];

        let containers: NodeListOf<Element> | null = null;
        
        // Find the first selector that returns results
        for (const selector of containerSelectors) {
          containers = document.querySelectorAll(selector);
          if (containers.length > 0) break;
        }

        if (!containers || containers.length === 0) {
          console.log('No listing containers found');
          return results;
        }

        containers.forEach((container, index) => {
          try {
            // Extract business name/title
            const titleSelectors = [
              '.listing-title a',
              '.business-title',
              '.title a',
              'h3 a',
              'h2 a',
              '.name a',
              'a[href*="/business-"]'
            ];
            
            let title = '';
            for (const selector of titleSelectors) {
              const titleEl = container.querySelector(selector);
              if (titleEl?.textContent?.trim()) {
                title = titleEl.textContent.trim();
                break;
              }
            }

            // Extract price
            const priceSelectors = [
              '.price',
              '.asking-price',
              '.list-price',
              '[data-testid="price"]',
              '.business-price'
            ];
            
            let price = '';
            for (const selector of priceSelectors) {
              const priceEl = container.querySelector(selector);
              if (priceEl?.textContent?.trim()) {
                price = priceEl.textContent.trim();
                break;
              }
            }

            // Extract location
            const locationSelectors = [
              '.location',
              '.business-location',
              '.city-state',
              '[data-testid="location"]',
              '.address'
            ];
            
            let location = '';
            for (const selector of locationSelectors) {
              const locationEl = container.querySelector(selector);
              if (locationEl?.textContent?.trim()) {
                location = locationEl.textContent.trim();
                break;
              }
            }

            // Extract industry/category
            const industrySelectors = [
              '.industry',
              '.category',
              '.business-type',
              '.sector',
              '[data-testid="industry"]'
            ];
            
            let industry = '';
            for (const selector of industrySelectors) {
              const industryEl = container.querySelector(selector);
              if (industryEl?.textContent?.trim()) {
                industry = industryEl.textContent.trim();
                break;
              }
            }

            // Extract description
            const descSelectors = [
              '.description',
              '.business-description',
              '.summary',
              '.excerpt'
            ];
            
            let description = '';
            for (const selector of descSelectors) {
              const descEl = container.querySelector(selector);
              if (descEl?.textContent?.trim()) {
                description = descEl.textContent.trim().substring(0, 200);
                break;
              }
            }

            // Extract link
            const linkSelectors = [
              'a[href*="/business-"]',
              '.listing-title a',
              '.title a',
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

            // Extract additional metadata
            const revenue = container.querySelector('.revenue, .gross-revenue')?.textContent?.trim() || '';
            const cashFlow = container.querySelector('.cash-flow, .net-income')?.textContent?.trim() || '';
            const established = container.querySelector('.established, .year-established')?.textContent?.trim() || '';

            // Only add if we have minimum required data
            if (title && (price || location)) {
              results.push({
                title,
                price,
                location,
                industry,
                description,
                link,
                revenue,
                cashFlow,
                established,
                source: 'bizbuysell',
                scrapedIndex: index
              });
            }

          } catch (error) {
            console.error(`Error extracting listing ${index}:`, error);
          }
        });

        return results;
      });

      this.logger.logDataExtracted(listings.slice(0, 3));
      return listings;

    } catch (error) {
      this.logger.error('Failed to extract listings', error);
      return [];
    }
  }

  private async handlePagination(page: Page): Promise<any[]> {
    const allListings: any[] = [];
    let currentPage = 1;
    const maxPages = this.config.pagination?.maxPages || 10;

    try {
      while (currentPage < maxPages) {
        // Look for next page button with multiple selectors
        const nextSelectors = [
          'a[aria-label="Next"]',
          '.pagination-next',
          '.next-page',
          'a[rel="next"]',
          '.pagination a:contains("Next")',
          '.pager-next a'
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

        // Check if next button is disabled
        const isDisabled = await page.evaluate((btn) => {
          return btn.hasAttribute('disabled') || 
                 btn.classList.contains('disabled') ||
                 btn.getAttribute('aria-disabled') === 'true';
        }, nextButton);

        if (isDisabled) {
          this.logger.info(`Next button disabled at page ${currentPage}`);
          break;
        }

        // Human-like delay before clicking
        await this.randomDelay(3000, 6000);
        
        // Scroll to next button before clicking
        await page.evaluate((btn) => {
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, nextButton);

        await this.randomDelay(1000, 2000);

        // Click next page
        await nextButton.click();
        
        // Wait for navigation or content change
        try {
          await page.waitForNavigation({ 
            waitUntil: 'networkidle2', 
            timeout: 30000 
          });
        } catch (error) {
          // If navigation doesn't occur, wait for content change
          await this.randomDelay(3000, 5000);
        }

        currentPage++;
        this.logger.info(`Navigated to page ${currentPage}`);

        // Wait for new listings to load
        await this.waitForListings(page);

        // Extract listings from this page
        const pageListings = await this.extractListings(page);
        allListings.push(...pageListings);

        // Break if no listings found (end of results)
        if (pageListings.length === 0) {
          this.logger.info(`No listings found on page ${currentPage}, stopping pagination`);
          break;
        }

        // Additional safety check for infinite loops
        if (currentPage > 50) {
          this.logger.warn('Reached maximum page limit (50), stopping pagination');
          break;
        }
      }
    } catch (error) {
      this.logger.error('Pagination handling failed', error);
    }

    return allListings;
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  public static getDefaultSearchParams(): BizBuySellSearchParams {
    return {
      // Default search for established businesses
      established: 2000,
      priceMin: 50000,
      priceMax: 5000000
    };
  }

  public static getIndustryOptions(): string[] {
    return [
      'restaurants',
      'retail',
      'automotive',
      'health-beauty-fitness',
      'manufacturing',
      'services-consumer',
      'services-business',
      'distribution',
      'technology',
      'real-estate',
      'travel-hospitality',
      'franchises'
    ];
  }

  // Method to handle specific BizBuySell challenges
  private async handleBizBuySellSpecificChallenges(page: Page): Promise<void> {
    try {
      // Handle potential login modal
      const loginModal = await page.$('.login-modal, .auth-modal');
      if (loginModal) {
        const closeButton = await page.$('.modal-close, .close-button, [aria-label="Close"]');
        if (closeButton) {
          await closeButton.click();
          await this.randomDelay(1000, 2000);
        }
      }

      // Handle potential subscription prompts
      const subscriptionPrompt = await page.$('.subscription-prompt, .premium-modal');
      if (subscriptionPrompt) {
        const skipButton = await page.$('.skip-button, .not-now, .close');
        if (skipButton) {
          await skipButton.click();
          await this.randomDelay(1000, 2000);
        }
      }

      // Handle "verify you're human" challenges
      const verifyHuman = await page.$text => text.includes('verify') && text.includes('human'));
      if (verifyHuman) {
        this.logger.warn('Human verification challenge detected');
        // Could implement more sophisticated handling here
        await this.randomDelay(5000, 10000);
      }

    } catch (error) {
      this.logger.debug('No specific challenges found');
    }
  }
}