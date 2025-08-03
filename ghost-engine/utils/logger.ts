import winston from 'winston';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

export class Logger {
  private logger: winston.Logger;
  private logDir: string;

  constructor(logLevel: string = 'info', logFile: string = './logs/ghost-engine.log') {
    this.logDir = join(process.cwd(), 'logs');
    
    // Create logs directory if it doesn't exist
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
      defaultMeta: { service: 'ghost-engine' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // File transport
        new winston.transports.File({
          filename: join(this.logDir, 'error.log'),
          level: 'error'
        }),
        new winston.transports.File({
          filename: join(this.logDir, 'combined.log')
        }),
        // Rotating file transport for daily logs
        new winston.transports.File({
          filename: join(this.logDir, `ghost-engine-${new Date().toISOString().split('T')[0]}.log`),
          level: 'debug'
        })
      ]
    });
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: Error | any): void {
    this.logger.error(message, error instanceof Error ? { 
      error: error.message, 
      stack: error.stack 
    } : error);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public logScrapingActivity(scraperName: string, activity: string, data?: any): void {
    this.info(`[${scraperName}] ${activity}`, data);
  }

  public logProxyActivity(sessionId: string, activity: string, data?: any): void {
    this.info(`[PROXY:${sessionId}] ${activity}`, data);
  }

  public logEnrichmentActivity(source: string, activity: string, data?: any): void {
    this.info(`[ENRICHMENT:${source}] ${activity}`, data);
  }

  public logPerformanceMetrics(metrics: {
    scraperName: string;
    duration: number;
    recordsProcessed: number;
    successRate: number;
    errors: number;
  }): void {
    this.info(`[PERFORMANCE] ${metrics.scraperName}`, {
      duration_ms: metrics.duration,
      records_processed: metrics.recordsProcessed,
      success_rate: `${metrics.successRate}%`,
      errors: metrics.errors
    });
  }

  public createScraperLogger(scraperName: string): ScraperLogger {
    return new ScraperLogger(this, scraperName);
  }
}

export class ScraperLogger {
  constructor(private logger: Logger, private scraperName: string) {}

  public info(message: string, meta?: any): void {
    this.logger.logScrapingActivity(this.scraperName, message, meta);
  }

  public error(message: string, error?: Error | any): void {
    this.logger.error(`[${this.scraperName}] ${message}`, error);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(`[${this.scraperName}] ${message}`, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(`[${this.scraperName}] ${message}`, meta);
  }

  public logPageVisit(url: string, status: 'success' | 'failed' | 'blocked'): void {
    this.info(`Page visit: ${url}`, { status });
  }

  public logListingsFound(count: number, page?: number): void {
    this.info(`Found ${count} listings`, { page });
  }

  public logDataExtracted(data: any): void {
    this.debug('Data extracted', { sample: data });
  }

  public logCaptchaEncountered(url: string): void {
    this.warn(`Captcha encountered at: ${url}`);
  }

  public logRateLimitHit(url: string, retryAfter?: number): void {
    this.warn(`Rate limit hit at: ${url}`, { retryAfter });
  }
}