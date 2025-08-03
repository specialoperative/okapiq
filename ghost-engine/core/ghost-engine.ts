import { Cluster } from 'puppeteer-cluster';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page, Browser } from 'puppeteer';
import { ProxyManager } from '../proxy/proxy-manager';
import { Logger, ScraperLogger } from '../utils/logger';
import { GhostEngineConfig, ScraperConfig } from '../config/config';
import { DataNormalizer, NormalizedListing } from '../utils/data-normalizer';

// Add stealth plugin
puppeteer.use(StealthPlugin());

export interface ScrapingResult {
  listings: NormalizedListing[];
  metadata: {
    scraperName: string;
    url: string;
    timestamp: Date;
    recordsFound: number;
    processingTime: number;
    errors: string[];
  };
}

export interface HumanBehaviorConfig {
  scrollPattern: 'random' | 'natural' | 'fast';
  clickDelay: { min: number; max: number };
  typingSpeed: { min: number; max: number };
  mouseMovements: boolean;
  readingPauses: boolean;
}

export class GhostEngine {
  private cluster?: Cluster;
  private proxyManager: ProxyManager;
  private logger: Logger;
  private config: GhostEngineConfig;
  private dataNormalizer: DataNormalizer;
  private isRunning = false;

  constructor(config: GhostEngineConfig, proxyManager: ProxyManager, logger: Logger) {
    this.config = config;
    this.proxyManager = proxyManager;
    this.logger = logger;
    this.dataNormalizer = new DataNormalizer();
  }

  public async initialize(): Promise<void> {
    try {
      this.cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: this.config.browser.maxConcurrent,
        puppeteerOptions: {
          headless: this.config.browser.headless,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-blink-features=AutomationControlled',
            '--ignore-certificate-errors',
            '--ignore-ssl-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-extensions'
          ],
          defaultViewport: null
        },
        timeout: this.config.browser.timeout,
        retryLimit: this.config.browser.retries,
        retryDelay: 5000
      });

      this.isRunning = true;
      this.logger.info('Ghost Engine initialized successfully', {
        maxConcurrency: this.config.browser.maxConcurrent,
        headless: this.config.browser.headless
      });

    } catch (error) {
      this.logger.error('Failed to initialize Ghost Engine', error);
      throw error;
    }
  }

  public async scrapeWithAI(scraperConfig: ScraperConfig, searchParams?: any): Promise<ScrapingResult> {
    if (!this.cluster) {
      throw new Error('Ghost Engine not initialized');
    }

    const startTime = Date.now();
    const scraperLogger = this.logger.createScraperLogger(scraperConfig.name);
    const errors: string[] = [];
    let allListings: NormalizedListing[] = [];

    try {
      const result = await this.cluster.execute({ scraperConfig, searchParams, scraperLogger }, async ({ page, data }) => {
        const { scraperConfig, searchParams, scraperLogger } = data;
        return await this.performAIGuidedScraping(page, scraperConfig, searchParams, scraperLogger);
      });

      allListings = result.listings;
      if (result.errors) {
        errors.push(...result.errors);
      }

    } catch (error) {
      const errorMsg = `Scraping failed for ${scraperConfig.name}: ${error instanceof Error ? error.message : error}`;
      errors.push(errorMsg);
      scraperLogger.error(errorMsg, error);
    }

    const processingTime = Date.now() - startTime;
    
    // Log performance metrics
    this.logger.logPerformanceMetrics({
      scraperName: scraperConfig.name,
      duration: processingTime,
      recordsProcessed: allListings.length,
      successRate: allListings.length > 0 ? 100 - (errors.length / allListings.length * 100) : 0,
      errors: errors.length
    });

    return {
      listings: allListings,
      metadata: {
        scraperName: scraperConfig.name,
        url: scraperConfig.url,
        timestamp: new Date(),
        recordsFound: allListings.length,
        processingTime,
        errors
      }
    };
  }

  private async performAIGuidedScraping(
    page: Page, 
    scraperConfig: ScraperConfig, 
    searchParams: any,
    logger: ScraperLogger
  ): Promise<{ listings: NormalizedListing[]; errors?: string[] }> {
    const errors: string[] = [];
    const session = this.proxyManager.createSession();
    
    try {
      // Configure page with human-like behavior
      await this.setupHumanBehavior(page, session.userAgent);
      
      // Navigate to target URL
      const targetUrl = this.buildSearchUrl(scraperConfig.url, searchParams);
      logger.logPageVisit(targetUrl, 'success');
      
      await page.goto(targetUrl, { 
        waitUntil: 'networkidle2',
        timeout: this.config.browser.timeout 
      });

      // Handle potential anti-bot measures
      await this.handleAntiBot(page, logger);

      // Perform AI-guided content discovery
      const listings = await this.aiGuidedExtraction(page, scraperConfig, logger);
      
      // Handle pagination if configured
      if (scraperConfig.pagination) {
        const paginatedListings = await this.handlePagination(page, scraperConfig, logger);
        listings.push(...paginatedListings);
      }

      // Normalize the data
      const normalizedListings = this.dataNormalizer.normalize(listings, scraperConfig.name);
      
      logger.logListingsFound(normalizedListings.length);
      return { listings: normalizedListings };

    } catch (error) {
      const errorMsg = `AI-guided scraping failed: ${error instanceof Error ? error.message : error}`;
      errors.push(errorMsg);
      logger.error(errorMsg, error);
      return { listings: [], errors };
    }
  }

  private async setupHumanBehavior(page: Page, userAgent: string): Promise<void> {
    // Set random viewport size
    const viewports = this.config.browser.viewportSizes;
    const viewport = viewports[Math.floor(Math.random() * viewports.length)];
    await page.setViewport(viewport);

    // Set user agent
    await page.setUserAgent(userAgent);

    // Add human-like JavaScript fingerprint overrides
    await page.evaluateOnNewDocument(() => {
      // Override webdriver detection
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Add random device memory
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => Math.floor(Math.random() * 8) + 4,
      });

      // Override chrome runtime
      window.chrome = {
        runtime: {}
      };
    });

    // Set random extra headers to mimic real browsers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    });
  }

  private async handleAntiBot(page: Page, logger: ScraperLogger): Promise<void> {
    try {
      // Check for common anti-bot elements
      const captchaSelectors = [
        '[data-testid="captcha"]',
        '.g-recaptcha',
        '#recaptcha',
        '.captcha',
        '[src*="captcha"]'
      ];

      for (const selector of captchaSelectors) {
        const captcha = await page.$(selector);
        if (captcha) {
          logger.logCaptchaEncountered(page.url());
          // Implement captcha solving strategy
          await this.handleCaptcha(page, selector, logger);
          break;
        }
      }

      // Check for rate limiting
      const rateLimitIndicators = ['too many requests', 'rate limit', 'blocked', 'access denied'];
      const pageContent = await page.content();
      
      for (const indicator of rateLimitIndicators) {
        if (pageContent.toLowerCase().includes(indicator)) {
          logger.logRateLimitHit(page.url());
          await this.randomDelay(5000, 15000); // Wait longer on rate limit
          break;
        }
      }

      // Human-like delay after page load
      await this.randomDelay(1000, 3000);

    } catch (error) {
      logger.warn('Anti-bot handling encountered an error', error);
    }
  }

  private async handleCaptcha(page: Page, selector: string, logger: ScraperLogger): Promise<void> {
    // Simple captcha bypass strategies
    try {
      // Wait and see if it auto-resolves
      await this.randomDelay(3000, 8000);
      
      // Try refreshing the page
      await page.reload({ waitUntil: 'networkidle2' });
      
      // Check if captcha is still present
      const stillPresent = await page.$(selector);
      if (stillPresent) {
        logger.warn('Captcha persists after refresh attempt');
        // Could implement more advanced captcha solving here
      }
    } catch (error) {
      logger.error('Captcha handling failed', error);
    }
  }

  private async aiGuidedExtraction(page: Page, config: ScraperConfig, logger: ScraperLogger): Promise<any[]> {
    const listings: any[] = [];

    try {
      // Wait for content to load
      await page.waitForSelector(config.selectors.container, { timeout: 10000 });

      // Extract listings using AI-like pattern recognition
      const extractedData = await page.evaluate((selectors) => {
        const containers = document.querySelectorAll(selectors.container);
        const results: any[] = [];

        containers.forEach((container, index) => {
          try {
            // Extract basic information
            const titleElement = container.querySelector(selectors.title);
            const priceElement = container.querySelector(selectors.price);
            const locationElement = container.querySelector(selectors.location);
            const linkElement = container.querySelector(selectors.link);
            
            // AI-like text extraction and cleaning
            const title = titleElement?.textContent?.trim() || '';
            const price = priceElement?.textContent?.trim() || '';
            const location = locationElement?.textContent?.trim() || '';
            const link = linkElement?.getAttribute('href') || '';

            // Industry extraction (optional)
            let industry = '';
            if (selectors.industry) {
              const industryElement = container.querySelector(selectors.industry);
              industry = industryElement?.textContent?.trim() || '';
            }

            // Description extraction (optional)
            let description = '';
            if (selectors.description) {
              const descElement = container.querySelector(selectors.description);
              description = descElement?.textContent?.trim() || '';
            }

            // Only add if we have minimum required data
            if (title && (price || location)) {
              results.push({
                title,
                price,
                location,
                industry,
                description,
                link,
                rawIndex: index
              });
            }
          } catch (error) {
            console.error(`Error extracting listing ${index}:`, error);
          }
        });

        return results;
      }, config.selectors);

      listings.push(...extractedData);
      logger.logDataExtracted(extractedData.slice(0, 3)); // Log sample

      // Simulate human reading behavior
      await this.simulateHumanScroll(page);

    } catch (error) {
      logger.error('AI-guided extraction failed', error);
    }

    return listings;
  }

  private async handlePagination(page: Page, config: ScraperConfig, logger: ScraperLogger): Promise<any[]> {
    const allListings: any[] = [];
    let currentPage = 1;
    const maxPages = config.pagination?.maxPages || 10;

    try {
      while (currentPage < maxPages) {
        // Look for next page button
        const nextButton = await page.$(config.pagination!.selector);
        if (!nextButton) {
          logger.info(`No more pages found at page ${currentPage}`);
          break;
        }

        // Human-like delay before clicking
        await this.randomDelay(2000, 4000);
        
        // Click next page
        await nextButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

        currentPage++;
        logger.info(`Navigated to page ${currentPage}`);

        // Extract listings from this page
        const pageListings = await this.aiGuidedExtraction(page, config, logger);
        allListings.push(...pageListings);

        // Break if no listings found (end of results)
        if (pageListings.length === 0) {
          logger.info(`No listings found on page ${currentPage}, stopping pagination`);
          break;
        }
      }
    } catch (error) {
      logger.error('Pagination handling failed', error);
    }

    return allListings;
  }

  private async simulateHumanScroll(page: Page): Promise<void> {
    try {
      // Random scroll pattern
      const scrollCount = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < scrollCount; i++) {
        const scrollDistance = Math.floor(Math.random() * 800) + 200;
        await page.evaluate((distance) => {
          window.scrollBy(0, distance);
        }, scrollDistance);
        
        // Random pause between scrolls
        await this.randomDelay(800, 2000);
      }

      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await this.randomDelay(500, 1000);

    } catch (error) {
      // Scroll simulation is non-critical, just log the error
      this.logger.debug('Scroll simulation failed', error);
    }
  }

  private buildSearchUrl(baseUrl: string, searchParams?: any): string {
    if (!searchParams) return baseUrl;

    const url = new URL(baseUrl);
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        url.searchParams.append(key, searchParams[key]);
      }
    });

    return url.toString();
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  public async close(): Promise<void> {
    if (this.cluster) {
      await this.cluster.close();
      this.isRunning = false;
      this.logger.info('Ghost Engine closed successfully');
    }
  }

  public isEngineRunning(): boolean {
    return this.isRunning;
  }
}