import { Database } from 'sqlite3';
import { Logger } from '../utils/logger';
import { NormalizedListing } from '../utils/data-normalizer';
import { EnrichedListing } from '../enrichment/enrichment-agent';
import { SyncResult } from '../sync-scheduler';
import { join } from 'path';

export interface DatabaseConfig {
  type: 'sqlite' | 'mongodb';
  connectionString: string;
}

export interface ListingFilter {
  source?: string;
  industry?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export class DatabaseManager {
  private db?: Database;
  private config: DatabaseConfig;
  private logger: Logger;

  constructor(config: DatabaseConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  public async initialize(): Promise<void> {
    try {
      if (this.config.type === 'sqlite') {
        await this.initializeSQLite();
      } else {
        throw new Error('MongoDB support not implemented yet');
      }

      this.logger.info('Database Manager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Database Manager', error);
      throw error;
    }
  }

  private async initializeSQLite(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use the connection string as the database path
      const dbPath = this.config.connectionString.replace('sqlite:', '') || './ghost-engine.db';
      
      this.db = new Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.logger.info(`SQLite database connected: ${dbPath}`);
        
        // Create tables
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createTablesSQL = `
      -- Listings table
      CREATE TABLE IF NOT EXISTS listings (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        name TEXT NOT NULL,
        industry TEXT,
        location TEXT,
        price REAL,
        price_min REAL,
        price_max REAL,
        revenue REAL,
        description TEXT,
        contact_link TEXT,
        tags TEXT, -- JSON array
        coordinates_lat REAL,
        coordinates_lng REAL,
        scraped_at DATETIME NOT NULL,
        original_data TEXT, -- JSON
        confidence REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Enriched data table
      CREATE TABLE IF NOT EXISTS listing_enrichments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id TEXT NOT NULL,
        owner_email TEXT,
        owner_linkedin TEXT,
        owner_title TEXT,
        company_employees INTEGER,
        company_founded INTEGER,
        company_funding TEXT,
        company_valuation TEXT,
        enrichment_sources TEXT, -- JSON array
        enrichment_confidence REAL,
        enriched_at DATETIME NOT NULL,
        FOREIGN KEY (listing_id) REFERENCES listings (id)
      );

      -- Sync results table
      CREATE TABLE IF NOT EXISTS sync_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scraper_name TEXT NOT NULL,
        success BOOLEAN NOT NULL,
        records_scraped INTEGER DEFAULT 0,
        records_enriched INTEGER DEFAULT 0,
        records_stored INTEGER DEFAULT 0,
        duration INTEGER NOT NULL,
        errors TEXT, -- JSON array
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_listings_source ON listings (source);
      CREATE INDEX IF NOT EXISTS idx_listings_industry ON listings (industry);
      CREATE INDEX IF NOT EXISTS idx_listings_location ON listings (location);
      CREATE INDEX IF NOT EXISTS idx_listings_price ON listings (price);
      CREATE INDEX IF NOT EXISTS idx_listings_scraped_at ON listings (scraped_at);
      CREATE INDEX IF NOT EXISTS idx_sync_results_scraper ON sync_results (scraper_name);
      CREATE INDEX IF NOT EXISTS idx_sync_results_timestamp ON sync_results (timestamp);
    `;

    return new Promise((resolve, reject) => {
      this.db!.exec(createTablesSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          this.logger.info('Database tables created successfully');
          resolve();
        }
      });
    });
  }

  public async storeListings(listings: (NormalizedListing | EnrichedListing)[], source: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    let storedCount = 0;

    try {
      // Prepare statements for better performance
      const insertListingStmt = this.db.prepare(`
        INSERT OR REPLACE INTO listings (
          id, source, name, industry, location, price, price_min, price_max, 
          revenue, description, contact_link, tags, coordinates_lat, coordinates_lng,
          scraped_at, original_data, confidence, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertEnrichmentStmt = this.db.prepare(`
        INSERT OR REPLACE INTO listing_enrichments (
          listing_id, owner_email, owner_linkedin, owner_title, company_employees,
          company_founded, company_funding, company_valuation, enrichment_sources,
          enrichment_confidence, enriched_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const listing of listings) {
        try {
          // Store main listing data
          insertListingStmt.run(
            listing.id,
            listing.source,
            listing.name,
            listing.industry,
            listing.location,
            listing.price,
            listing.priceRange?.min || null,
            listing.priceRange?.max || null,
            listing.revenue,
            listing.description,
            listing.contactLink,
            JSON.stringify(listing.tags),
            listing.coordinates?.lat || null,
            listing.coordinates?.lng || null,
            listing.metadata.scrapedAt.toISOString(),
            JSON.stringify(listing.metadata.originalData),
            listing.metadata.confidence,
            new Date().toISOString()
          );

          // Store enrichment data if available
          const enrichedListing = listing as EnrichedListing;
          if (enrichedListing.enrichment) {
            insertEnrichmentStmt.run(
              listing.id,
              enrichedListing.enrichment.owner?.email || null,
              enrichedListing.enrichment.owner?.linkedinProfile || null,
              enrichedListing.enrichment.owner?.title || null,
              enrichedListing.enrichment.companyInfo?.employees || null,
              enrichedListing.enrichment.companyInfo?.founded || null,
              enrichedListing.enrichment.companyInfo?.funding || null,
              enrichedListing.enrichment.companyInfo?.valuation || null,
              JSON.stringify(enrichedListing.enrichment.sources),
              enrichedListing.enrichment.confidence,
              enrichedListing.enrichment.enrichedAt.toISOString()
            );
          }

          storedCount++;

        } catch (error) {
          this.logger.error(`Failed to store listing ${listing.id}`, error);
        }
      }

      insertListingStmt.finalize();
      insertEnrichmentStmt.finalize();

      this.logger.info(`Stored ${storedCount} listings from ${source}`);

    } catch (error) {
      this.logger.error('Failed to store listings', error);
      throw error;
    }

    return storedCount;
  }

  public async getListings(filter: ListingFilter = {}): Promise<NormalizedListing[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `
      SELECT 
        l.*,
        e.owner_email, e.owner_linkedin, e.owner_title,
        e.company_employees, e.company_founded, e.company_funding, e.company_valuation,
        e.enrichment_sources, e.enrichment_confidence, e.enriched_at
      FROM listings l
      LEFT JOIN listing_enrichments e ON l.id = e.listing_id
      WHERE 1=1
    `;

    const params: any[] = [];

    // Apply filters
    if (filter.source) {
      query += ' AND l.source = ?';
      params.push(filter.source);
    }

    if (filter.industry) {
      query += ' AND l.industry = ?';
      params.push(filter.industry);
    }

    if (filter.location) {
      query += ' AND l.location LIKE ?';
      params.push(`%${filter.location}%`);
    }

    if (filter.minPrice) {
      query += ' AND l.price >= ?';
      params.push(filter.minPrice);
    }

    if (filter.maxPrice) {
      query += ' AND l.price <= ?';
      params.push(filter.maxPrice);
    }

    if (filter.dateFrom) {
      query += ' AND l.scraped_at >= ?';
      params.push(filter.dateFrom.toISOString());
    }

    if (filter.dateTo) {
      query += ' AND l.scraped_at <= ?';
      params.push(filter.dateTo.toISOString());
    }

    // Add ordering and pagination
    query += ' ORDER BY l.scraped_at DESC';

    if (filter.limit) {
      query += ' LIMIT ?';
      params.push(filter.limit);
    }

    if (filter.offset) {
      query += ' OFFSET ?';
      params.push(filter.offset);
    }

    return new Promise((resolve, reject) => {
      this.db!.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const listings: NormalizedListing[] = rows.map(row => {
          const listing: NormalizedListing = {
            id: row.id,
            source: row.source,
            name: row.name,
            industry: row.industry,
            location: row.location,
            price: row.price,
            priceRange: row.price_min || row.price_max ? {
              min: row.price_min,
              max: row.price_max
            } : undefined,
            revenue: row.revenue,
            description: row.description,
            contactLink: row.contact_link,
            tags: JSON.parse(row.tags || '[]'),
            coordinates: row.coordinates_lat && row.coordinates_lng ? {
              lat: row.coordinates_lat,
              lng: row.coordinates_lng
            } : undefined,
            metadata: {
              scrapedAt: new Date(row.scraped_at),
              originalData: JSON.parse(row.original_data || '{}'),
              confidence: row.confidence
            }
          };

          return listing;
        });

        resolve(listings);
      });
    });
  }

  public async getListingStats(): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    const statsQuery = `
      SELECT 
        COUNT(*) as total_listings,
        COUNT(DISTINCT source) as total_sources,
        COUNT(DISTINCT industry) as total_industries,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(confidence) as avg_confidence
      FROM listings
    `;

    const sourceStatsQuery = `
      SELECT source, COUNT(*) as count 
      FROM listings 
      GROUP BY source 
      ORDER BY count DESC
    `;

    const industryStatsQuery = `
      SELECT industry, COUNT(*) as count 
      FROM listings 
      GROUP BY industry 
      ORDER BY count DESC
      LIMIT 10
    `;

    return new Promise((resolve, reject) => {
      const stats: any = {};

      // Get overall stats
      this.db!.get(statsQuery, (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        stats.overall = row;

        // Get source stats
        this.db!.all(sourceStatsQuery, (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          stats.by_source = rows;

          // Get industry stats
          this.db!.all(industryStatsQuery, (err, rows: any[]) => {
            if (err) {
              reject(err);
              return;
            }

            stats.by_industry = rows;
            resolve(stats);
          });
        });
      });
    });
  }

  public async storeSyncResult(result: SyncResult): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const insertSQL = `
      INSERT INTO sync_results (
        scraper_name, success, records_scraped, records_enriched, 
        records_stored, duration, errors, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db!.run(
        insertSQL,
        [
          result.scraperName,
          result.success ? 1 : 0,
          result.recordsScraped,
          result.recordsEnriched,
          result.recordsStored,
          result.duration,
          JSON.stringify(result.errors),
          result.timestamp.toISOString()
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public async getLastSyncResults(scraperName?: string): Promise<SyncResult[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `
      SELECT * FROM sync_results 
      WHERE 1=1
    `;

    const params: any[] = [];

    if (scraperName) {
      query += ' AND scraper_name = ?';
      params.push(scraperName);
    }

    query += ' ORDER BY timestamp DESC LIMIT 50';

    return new Promise((resolve, reject) => {
      this.db!.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const results: SyncResult[] = rows.map(row => ({
          scraperName: row.scraper_name,
          success: row.success === 1,
          recordsScraped: row.records_scraped,
          recordsEnriched: row.records_enriched,
          recordsStored: row.records_stored,
          duration: row.duration,
          errors: JSON.parse(row.errors || '[]'),
          timestamp: new Date(row.timestamp)
        }));

        resolve(results);
      });
    });
  }

  public async deduplicateListings(source?: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    // Simple deduplication based on name and location
    let deleteSQL = `
      DELETE FROM listings 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM listings 
        GROUP BY LOWER(name), LOWER(location)
      )
    `;

    if (source) {
      deleteSQL = `
        DELETE FROM listings 
        WHERE source = ? AND id NOT IN (
          SELECT MIN(id) 
          FROM listings 
          WHERE source = ?
          GROUP BY LOWER(name), LOWER(location)
        )
      `;
    }

    return new Promise((resolve, reject) => {
      const params = source ? [source, source] : [];
      
      this.db!.run(deleteSQL, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  public async cleanupOldListings(source?: string, daysOld: number = 90): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deleteSQL = `
      DELETE FROM listings 
      WHERE scraped_at < ?
    `;

    const params = [cutoffDate.toISOString()];

    if (source) {
      deleteSQL += ' AND source = ?';
      params.push(source);
    }

    return new Promise((resolve, reject) => {
      this.db!.run(deleteSQL, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  public async healthCheck(): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      this.db!.get('SELECT 1', (err) => {
        resolve(!err);
      });
    });
  }

  public async close(): Promise<void> {
    if (this.db) {
      return new Promise((resolve) => {
        this.db!.close((err) => {
          if (err) {
            this.logger.error('Error closing database', err);
          } else {
            this.logger.info('Database connection closed');
          }
          resolve();
        });
      });
    }
  }
}