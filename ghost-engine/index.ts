#!/usr/bin/env ts-node

import { SyncScheduler } from './sync-scheduler';
import { Logger } from './utils/logger';
import { getConfig } from './config/config';

// Express for API endpoints
import express from 'express';
import cors from 'cors';

export class GhostEngineApp {
  private scheduler: SyncScheduler;
  private logger: Logger;
  private app: express.Application;
  private server?: any;
  private config = getConfig();

  constructor() {
    this.logger = new Logger(this.config.logging.level, this.config.logging.file);
    this.scheduler = new SyncScheduler();
    this.app = express();
    this.setupExpress();
  }

  private setupExpress(): void {
    // Middleware
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      next();
    });

    this.setupApiRoutes();
  }

  private setupApiRoutes(): void {
    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const health = await this.scheduler.healthCheck();
        res.json({ status: 'ok', ...health });
      } catch (error) {
        res.status(500).json({ 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all listings with filtering
    this.app.get('/api/listings', async (req, res) => {
      try {
        const filter = {
          source: req.query.source as string,
          industry: req.query.industry as string,
          location: req.query.location as string,
          minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
          maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
          dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
          dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : 50,
          offset: req.query.offset ? Number(req.query.offset) : 0
        };

        const listings = await this.scheduler['dataManager'].getListings(filter);
        res.json({
          success: true,
          data: listings,
          count: listings.length,
          filters: filter
        });

      } catch (error) {
        this.logger.error('Failed to get listings', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get listing statistics
    this.app.get('/api/stats', async (req, res) => {
      try {
        const stats = await this.scheduler['dataManager'].getListingStats();
        res.json({ success: true, data: stats });
      } catch (error) {
        this.logger.error('Failed to get stats', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get sync job status
    this.app.get('/api/sync/status', (req, res) => {
      try {
        const status = this.scheduler.getJobStatus();
        res.json({ success: true, data: status });
      } catch (error) {
        this.logger.error('Failed to get sync status', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get sync results
    this.app.get('/api/sync/results', async (req, res) => {
      try {
        const scraperName = req.query.scraper as string;
        const results = await this.scheduler.getLastSyncResults(scraperName);
        res.json({ success: true, data: results });
      } catch (error) {
        this.logger.error('Failed to get sync results', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Trigger manual sync for specific scraper
    this.app.post('/api/sync/run/:scraperName', async (req, res) => {
      try {
        const { scraperName } = req.params;
        
        this.logger.info(`Manual sync triggered for: ${scraperName}`);
        
        // Run sync in background
        this.scheduler.runSingleSync(scraperName)
          .then(result => {
            this.logger.info(`Manual sync completed for ${scraperName}`, result);
          })
          .catch(error => {
            this.logger.error(`Manual sync failed for ${scraperName}`, error);
          });

        res.json({ 
          success: true, 
          message: `Sync started for ${scraperName}`,
          scraperName 
        });

      } catch (error) {
        this.logger.error('Failed to start sync', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Trigger manual sync for all scrapers
    this.app.post('/api/sync/run-all', async (req, res) => {
      try {
        this.logger.info('Manual sync triggered for all scrapers');
        
        // Run all syncs in background
        this.scheduler.runAllSyncs()
          .then(results => {
            this.logger.info('Manual sync completed for all scrapers', {
              totalScrapers: results.length,
              successful: results.filter(r => r.success).length,
              failed: results.filter(r => !r.success).length
            });
          })
          .catch(error => {
            this.logger.error('Manual sync failed for all scrapers', error);
          });

        res.json({ 
          success: true, 
          message: 'Sync started for all scrapers'
        });

      } catch (error) {
        this.logger.error('Failed to start sync for all scrapers', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Test individual scraper
    this.app.post('/api/test/:scraperName', async (req, res) => {
      try {
        const { scraperName } = req.params;
        const searchParams = req.body;
        
        this.logger.info(`Testing scraper: ${scraperName}`, searchParams);
        
        const result = await this.scheduler.testScraper(scraperName, searchParams);
        
        res.json({ 
          success: true, 
          data: result,
          scraperName
        });

      } catch (error) {
        this.logger.error('Scraper test failed', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get sync statistics
    this.app.get('/api/sync/stats', async (req, res) => {
      try {
        const stats = await this.scheduler.getSyncStats();
        res.json({ success: true, data: stats });
      } catch (error) {
        this.logger.error('Failed to get sync stats', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get available scrapers and their configurations
    this.app.get('/api/scrapers', (req, res) => {
      try {
        const scrapers = this.config.scrapers.map(scraper => ({
          name: scraper.name,
          url: scraper.url,
          syncInterval: scraper.syncInterval,
          description: `Scraper for ${scraper.name}`
        }));

        res.json({ success: true, data: scrapers });
      } catch (error) {
        this.logger.error('Failed to get scrapers', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Error handling middleware
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      this.logger.error('Express error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    });
  }

  public async start(): Promise<void> {
    try {
      this.logger.info('🚀 Starting Ghost Engine System...');

      // Initialize the scheduler
      await this.scheduler.initialize();

      // Start the scheduler
      this.scheduler.startScheduler();

      // Start the API server
      const port = process.env.PORT || 3001;
      this.server = this.app.listen(port, () => {
        this.logger.info(`🌐 Ghost Engine API server started on port ${port}`);
        this.logger.info(`📊 Health check: http://localhost:${port}/health`);
        this.logger.info(`📋 API documentation: http://localhost:${port}/api/scrapers`);
      });

      // Graceful shutdown handlers
      process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));

      this.logger.info('✅ Ghost Engine System started successfully');

    } catch (error) {
      this.logger.error('❌ Failed to start Ghost Engine System', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    this.logger.info(`🔄 Received ${signal}, starting graceful shutdown...`);

    try {
      // Stop accepting new requests
      if (this.server) {
        this.server.close();
      }

      // Stop the scheduler
      await this.scheduler.close();

      this.logger.info('✅ Graceful shutdown completed');
      process.exit(0);

    } catch (error) {
      this.logger.error('❌ Error during shutdown', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    await this.gracefulShutdown('MANUAL');
  }
}

// CLI functionality
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const app = new GhostEngineApp();

  switch (command) {
    case 'start':
    case undefined:
      await app.start();
      break;

    case 'test':
      const scraperName = args[1];
      if (!scraperName) {
        console.error('Usage: npm run scraper:dev test <scraperName>');
        process.exit(1);
      }
      
      await app.scheduler.initialize();
      
      try {
        const result = await app.scheduler.testScraper(scraperName);
        console.log('Test Results:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('Test failed:', error);
      } finally {
        await app.scheduler.close();
        process.exit(0);
      }
      break;

    case 'sync':
      const syncTarget = args[1];
      await app.scheduler.initialize();
      
      try {
        if (syncTarget === 'all') {
          const results = await app.scheduler.runAllSyncs();
          console.log('Sync Results:', JSON.stringify(results, null, 2));
        } else if (syncTarget) {
          const result = await app.scheduler.runSingleSync(syncTarget);
          console.log('Sync Result:', JSON.stringify(result, null, 2));
        } else {
          console.error('Usage: npm run scraper:sync [all|<scraperName>]');
          process.exit(1);
        }
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        await app.scheduler.close();
        process.exit(0);
      }
      break;

    case 'health':
      await app.scheduler.initialize();
      
      try {
        const health = await app.scheduler.healthCheck();
        console.log('Health Check:', JSON.stringify(health, null, 2));
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        await app.scheduler.close();
        process.exit(0);
      }
      break;

    default:
      console.log(`
🧱 Ghost Engine System - Business Listings Scraper Network

Usage:
  npm run scraper:dev [command]

Commands:
  start              Start the Ghost Engine system with API server (default)
  test <scraper>     Test a specific scraper
  sync <scraper>     Run sync for a specific scraper
  sync all           Run sync for all scrapers
  health             Check system health

Examples:
  npm run scraper:dev
  npm run scraper:dev test bizbuysell
  npm run scraper:dev sync loopnet
  npm run scraper:dev sync all
  npm run scraper:dev health

API Endpoints (when running):
  GET  /health                     - System health check
  GET  /api/listings               - Get scraped listings with filters
  GET  /api/stats                  - Get listing statistics
  GET  /api/scrapers               - Get available scrapers
  GET  /api/sync/status            - Get sync job status
  GET  /api/sync/results           - Get sync results
  POST /api/sync/run/:scraperName  - Trigger manual sync
  POST /api/sync/run-all           - Trigger sync for all scrapers
  POST /api/test/:scraperName      - Test a scraper
      `);
      break;
  }
}

// Export for module usage
export { SyncScheduler } from './sync-scheduler';
export { GhostEngine } from './core/ghost-engine';
export { ProxyManager } from './proxy/proxy-manager';
export { EnrichmentAgent } from './enrichment/enrichment-agent';
export { DataNormalizer } from './utils/data-normalizer';
export { Logger } from './utils/logger';

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}