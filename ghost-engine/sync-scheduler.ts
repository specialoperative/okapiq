import * as cron from 'node-cron';
import { GhostEngine } from './core/ghost-engine';
import { ProxyManager } from './proxy/proxy-manager';
import { EnrichmentAgent } from './enrichment/enrichment-agent';
import { Logger } from './utils/logger';
import { DataNormalizer } from './utils/data-normalizer';
import { getConfig, ScraperConfig } from './config/config';
import { DatabaseManager } from './database/database-manager';

export interface SyncJob {
  id: string;
  scraperName: string;
  schedule: string;
  lastRun?: Date;
  nextRun?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  task?: cron.ScheduledTask;
}

export interface SyncResult {
  scraperName: string;
  success: boolean;
  recordsScraped: number;
  recordsEnriched: number;
  recordsStored: number;
  duration: number;
  errors: string[];
  timestamp: Date;
}

export class SyncScheduler {
  private logger: Logger;
  private ghostEngine: GhostEngine;
  private proxyManager: ProxyManager;
  private enrichmentAgent: EnrichmentAgent;
  private dataManager: DatabaseManager;
  private jobs: Map<string, SyncJob> = new Map();
  private config = getConfig();
  private isRunning = false;

  constructor() {
    this.logger = new Logger(this.config.logging.level, this.config.logging.file);
    this.proxyManager = new ProxyManager(this.config.proxies, this.logger);
    this.ghostEngine = new GhostEngine(this.config, this.proxyManager, this.logger);
    this.enrichmentAgent = new EnrichmentAgent(this.config.enrichment, this.logger);
    this.dataManager = new DatabaseManager(this.config.database, this.logger);
  }

  public async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Sync Scheduler...');

      // Initialize all components
      await this.ghostEngine.initialize();
      await this.dataManager.initialize();

      // Setup sync jobs for each scraper
      this.setupSyncJobs();

      this.isRunning = true;
      this.logger.info('Sync Scheduler initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Sync Scheduler', error);
      throw error;
    }
  }

  private setupSyncJobs(): void {
    this.config.scrapers.forEach(scraperConfig => {
      const jobId = `sync_${scraperConfig.name}`;
      const schedule = this.getScheduleFromInterval(scraperConfig.syncInterval);

      const job: SyncJob = {
        id: jobId,
        scraperName: scraperConfig.name,
        schedule,
        status: 'pending'
      };

      // Create cron task
      job.task = cron.schedule(schedule, async () => {
        await this.executeSyncJob(scraperConfig);
      }, {
        scheduled: false, // Don't start immediately
        timezone: this.config.scheduling.timezone
      });

      this.jobs.set(jobId, job);
      this.logger.info(`Created sync job for ${scraperConfig.name} with schedule: ${schedule}`);
    });
  }

  private getScheduleFromInterval(interval: 'daily' | 'weekly' | 'monthly'): string {
    switch (interval) {
      case 'daily':
        return '0 2 * * *'; // 2 AM every day
      case 'weekly':
        return '0 3 * * 1'; // 3 AM every Monday
      case 'monthly':
        return '0 4 1 * *'; // 4 AM on the 1st of every month
      default:
        return '0 2 * * *'; // Default to daily
    }
  }

  public startScheduler(): void {
    if (!this.isRunning) {
      throw new Error('Scheduler not initialized');
    }

    this.jobs.forEach(job => {
      if (job.task) {
        job.task.start();
        job.nextRun = new Date(job.task.getNext().toDate());
        this.logger.info(`Started sync job: ${job.scraperName}, next run: ${job.nextRun}`);
      }
    });

    this.logger.info('Sync Scheduler started');
  }

  public stopScheduler(): void {
    this.jobs.forEach(job => {
      if (job.task) {
        job.task.stop();
      }
    });

    this.logger.info('Sync Scheduler stopped');
  }

  public async executeSyncJob(scraperConfig: ScraperConfig): Promise<SyncResult> {
    const jobId = `sync_${scraperConfig.name}`;
    const job = this.jobs.get(jobId);
    
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const startTime = Date.now();
    job.status = 'running';
    job.lastRun = new Date();

    this.logger.info(`Starting sync job: ${scraperConfig.name}`);

    const result: SyncResult = {
      scraperName: scraperConfig.name,
      success: false,
      recordsScraped: 0,
      recordsEnriched: 0,
      recordsStored: 0,
      duration: 0,
      errors: [],
      timestamp: new Date()
    };

    try {
      // Step 1: Scrape listings
      this.logger.info(`[${scraperConfig.name}] Starting scraping phase`);
      const scrapingResult = await this.ghostEngine.scrapeWithAI(scraperConfig);
      
      result.recordsScraped = scrapingResult.listings.length;
      result.errors.push(...scrapingResult.metadata.errors);

      if (scrapingResult.listings.length === 0) {
        this.logger.warn(`[${scraperConfig.name}] No listings found`);
        job.status = 'completed';
        result.success = true;
        return result;
      }

      // Step 2: Enrich listings (if enabled)
      let enrichedListings = scrapingResult.listings;
      if (this.config.enrichment.enableApollo || this.config.enrichment.enableCrunchbase || this.config.enrichment.enableLinkedIn) {
        this.logger.info(`[${scraperConfig.name}] Starting enrichment phase`);
        
        try {
          const enrichmentResults = await this.enrichmentAgent.batchEnrich(scrapingResult.listings, 5);
          enrichedListings = enrichmentResults;
          result.recordsEnriched = enrichmentResults.length;
        } catch (error) {
          this.logger.error(`[${scraperConfig.name}] Enrichment failed`, error);
          result.errors.push(`Enrichment failed: ${error instanceof Error ? error.message : error}`);
          // Continue with non-enriched data
        }
      }

      // Step 3: Store listings in database
      this.logger.info(`[${scraperConfig.name}] Starting storage phase`);
      const storedCount = await this.dataManager.storeListings(enrichedListings, scraperConfig.name);
      result.recordsStored = storedCount;

      // Step 4: Cleanup and deduplication
      if (storedCount > 0) {
        await this.dataManager.deduplicateListings(scraperConfig.name);
        await this.dataManager.cleanupOldListings(scraperConfig.name);
      }

      job.status = 'completed';
      result.success = true;
      
      this.logger.info(`[${scraperConfig.name}] Sync completed successfully`, {
        scraped: result.recordsScraped,
        enriched: result.recordsEnriched,
        stored: result.recordsStored
      });

    } catch (error) {
      job.status = 'failed';
      result.success = false;
      const errorMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(errorMsg);
      
      this.logger.error(`[${scraperConfig.name}] Sync failed`, error);

      // Retry logic
      if (this.shouldRetry(scraperConfig.name)) {
        this.logger.info(`[${scraperConfig.name}] Scheduling retry`);
        setTimeout(() => {
          this.executeSyncJob(scraperConfig);
        }, 30 * 60 * 1000); // Retry in 30 minutes
      }
    }

    result.duration = Date.now() - startTime;

    // Update next run time
    if (job.task) {
      job.nextRun = new Date(job.task.getNext().toDate());
    }

    // Log performance metrics
    this.logger.logPerformanceMetrics({
      scraperName: scraperConfig.name,
      duration: result.duration,
      recordsProcessed: result.recordsScraped,
      successRate: result.success ? 100 : 0,
      errors: result.errors.length
    });

    // Store sync result
    await this.dataManager.storeSyncResult(result);

    return result;
  }

  private shouldRetry(scraperName: string): boolean {
    // Simple retry logic - could be enhanced with more sophisticated rules
    const recentFailures = this.getRecentFailureCount(scraperName);
    return recentFailures < this.config.scheduling.maxRetries;
  }

  private getRecentFailureCount(scraperName: string): number {
    // This would query the database for recent failures
    // For now, return a simple count
    return 0;
  }

  public async runSingleSync(scraperName: string): Promise<SyncResult> {
    const scraperConfig = this.config.scrapers.find(s => s.name === scraperName);
    if (!scraperConfig) {
      throw new Error(`Scraper not found: ${scraperName}`);
    }

    return await this.executeSyncJob(scraperConfig);
  }

  public async runAllSyncs(): Promise<SyncResult[]> {
    this.logger.info('Running all sync jobs manually');
    
    const results: SyncResult[] = [];
    
    // Run syncs sequentially to avoid overwhelming resources
    for (const scraperConfig of this.config.scrapers) {
      try {
        const result = await this.executeSyncJob(scraperConfig);
        results.push(result);
        
        // Wait between syncs to be polite to target sites
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        this.logger.error(`Manual sync failed for ${scraperConfig.name}`, error);
        
        results.push({
          scraperName: scraperConfig.name,
          success: false,
          recordsScraped: 0,
          recordsEnriched: 0,
          recordsStored: 0,
          duration: 0,
          errors: [error instanceof Error ? error.message : String(error)],
          timestamp: new Date()
        });
      }
    }
    
    return results;
  }

  public getJobStatus(): SyncJob[] {
    return Array.from(this.jobs.values()).map(job => ({
      ...job,
      task: undefined // Don't expose the actual cron task
    }));
  }

  public async getLastSyncResults(scraperName?: string): Promise<SyncResult[]> {
    return await this.dataManager.getLastSyncResults(scraperName);
  }

  public async getSyncStats(): Promise<any> {
    const stats = {
      totalJobs: this.jobs.size,
      runningJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      nextRuns: [] as any[]
    };

    this.jobs.forEach(job => {
      switch (job.status) {
        case 'running':
          stats.runningJobs++;
          break;
        case 'completed':
          stats.completedJobs++;
          break;
        case 'failed':
          stats.failedJobs++;
          break;
      }

      if (job.nextRun) {
        stats.nextRuns.push({
          scraperName: job.scraperName,
          nextRun: job.nextRun
        });
      }
    });

    // Sort next runs by time
    stats.nextRuns.sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime());

    return stats;
  }

  public async close(): Promise<void> {
    this.stopScheduler();
    
    if (this.ghostEngine) {
      await this.ghostEngine.close();
    }
    
    if (this.dataManager) {
      await this.dataManager.close();
    }
    
    this.logger.info('Sync Scheduler closed');
  }

  // Manual trigger methods for testing/debugging
  public async testScraper(scraperName: string, searchParams?: any): Promise<any> {
    const scraperConfig = this.config.scrapers.find(s => s.name === scraperName);
    if (!scraperConfig) {
      throw new Error(`Scraper not found: ${scraperName}`);
    }

    this.logger.info(`Testing scraper: ${scraperName}`);
    
    const result = await this.ghostEngine.scrapeWithAI(scraperConfig, searchParams);
    
    this.logger.info(`Test completed for ${scraperName}`, {
      listingsFound: result.listings.length,
      processingTime: result.metadata.processingTime,
      errors: result.metadata.errors.length
    });

    return result;
  }

  public async healthCheck(): Promise<any> {
    const health = {
      scheduler: this.isRunning,
      ghostEngine: this.ghostEngine.isEngineRunning(),
      database: await this.dataManager.healthCheck(),
      proxy: this.proxyManager.getSessionStats(),
      jobs: this.getJobStatus().map(job => ({
        name: job.scraperName,
        status: job.status,
        nextRun: job.nextRun
      }))
    };

    return health;
  }
}