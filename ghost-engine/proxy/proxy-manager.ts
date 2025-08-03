import axios, { AxiosRequestConfig } from 'axios';
import { ProxyConfig } from '../config/config';
import { Logger } from '../utils/logger';

export interface ProxySession {
  id: string;
  proxy: string;
  userAgent: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  lastUsed: Date;
  requestCount: number;
  isActive: boolean;
}

export class ProxyManager {
  private proxies: ProxyConfig[];
  private sessions: Map<string, ProxySession> = new Map();
  private currentProxyIndex = 0;
  private logger: Logger;
  private rotationInterval: number;

  constructor(proxies: ProxyConfig[], logger: Logger) {
    this.proxies = proxies;
    this.logger = logger;
    this.rotationInterval = proxies[0]?.rotationInterval || 30;
    this.startRotationTimer();
  }

  private startRotationTimer(): void {
    setInterval(() => {
      this.rotateProxies();
    }, this.rotationInterval * 60 * 1000); // Convert minutes to milliseconds
  }

  private getRandomUserAgent(): string {
    const userAgents = [
      // Desktop Chrome
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      
      // Desktop Firefox
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
      
      // Mobile Chrome
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      
      // Mobile Safari
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    ];
    
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  private generateRandomHeaders(): Record<string, string> {
    const baseHeaders = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // Randomly add optional headers
    const optionalHeaders = [
      { 'Sec-Fetch-Dest': 'document' },
      { 'Sec-Fetch-Mode': 'navigate' },
      { 'Sec-Fetch-Site': 'none' },
      { 'Sec-Fetch-User': '?1' },
      { 'Cache-Control': 'max-age=0' }
    ];

    optionalHeaders.forEach(header => {
      if (Math.random() > 0.3) { // 70% chance to include
        Object.assign(baseHeaders, header);
      }
    });

    return baseHeaders;
  }

  public createSession(): ProxySession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const proxy = this.getCurrentProxy();
    
    const session: ProxySession = {
      id: sessionId,
      proxy,
      userAgent: this.getRandomUserAgent(),
      headers: this.generateRandomHeaders(),
      cookies: {},
      lastUsed: new Date(),
      requestCount: 0,
      isActive: true
    };

    this.sessions.set(sessionId, session);
    this.logger.info(`Created new proxy session: ${sessionId} with proxy: ${proxy}`);
    
    return session;
  }

  private getCurrentProxy(): string {
    if (this.proxies.length === 0) {
      return ''; // No proxy - direct connection
    }

    const currentProxy = this.proxies[this.currentProxyIndex];
    const endpoint = currentProxy.endpoints[Math.floor(Math.random() * currentProxy.endpoints.length)];
    
    return endpoint;
  }

  private rotateProxies(): void {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
    this.logger.info(`Rotated to proxy index: ${this.currentProxyIndex}`);
    
    // Mark old sessions as inactive
    this.sessions.forEach(session => {
      if (session.requestCount > 50 || Date.now() - session.lastUsed.getTime() > 30 * 60 * 1000) {
        session.isActive = false;
      }
    });
  }

  public async makeRequest(sessionId: string, url: string, options: AxiosRequestConfig = {}): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error(`Invalid or inactive session: ${sessionId}`);
    }

    // Update session
    session.lastUsed = new Date();
    session.requestCount++;

    const config: AxiosRequestConfig = {
      ...options,
      url,
      headers: {
        ...session.headers,
        'User-Agent': session.userAgent,
        ...options.headers
      },
      timeout: 30000,
      maxRedirects: 5,
    };

    // Add proxy configuration if available
    if (session.proxy) {
      const proxyUrl = new URL(session.proxy);
      config.proxy = {
        protocol: proxyUrl.protocol.slice(0, -1), // Remove trailing ':'
        host: proxyUrl.hostname,
        port: parseInt(proxyUrl.port) || 8080,
        auth: proxyUrl.username && proxyUrl.password ? {
          username: proxyUrl.username,
          password: proxyUrl.password
        } : undefined
      };
    }

    try {
      // Add random delay to mimic human behavior
      await this.randomDelay(500, 2000);
      
      const response = await axios(config);
      
      this.logger.debug(`Request successful for session ${sessionId}: ${url}`);
      return response;
    } catch (error) {
      this.logger.error(`Request failed for session ${sessionId}: ${url}`, error);
      
      // If too many failures, mark session as inactive
      if (session.requestCount % 10 === 0 && session.requestCount > 20) {
        session.isActive = false;
        this.logger.warn(`Deactivated session ${sessionId} due to repeated failures`);
      }
      
      throw error;
    }
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  public getActiveSessionCount(): number {
    return Array.from(this.sessions.values()).filter(s => s.isActive).length;
  }

  public cleanupInactiveSessions(): void {
    const inactiveSessions = Array.from(this.sessions.entries())
      .filter(([_, session]) => !session.isActive);
    
    inactiveSessions.forEach(([sessionId, _]) => {
      this.sessions.delete(sessionId);
    });

    this.logger.info(`Cleaned up ${inactiveSessions.length} inactive sessions`);
  }

  public getSessionStats(): { total: number; active: number; avgRequests: number } {
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter(s => s.isActive);
    const avgRequests = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.requestCount, 0) / sessions.length 
      : 0;

    return {
      total: sessions.length,
      active: activeSessions.length,
      avgRequests: Math.round(avgRequests)
    };
  }
}

export class TorProxyManager extends ProxyManager {
  constructor(logger: Logger) {
    const torConfig: ProxyConfig = {
      provider: 'tor',
      endpoints: ['socks5://127.0.0.1:9050'],
      rotationInterval: 10 // More frequent rotation for Tor
    };
    
    super([torConfig], logger);
  }

  public async renewTorCircuit(): Promise<void> {
    try {
      // Send NEWNYM signal to Tor control port
      const torControl = axios.create({
        baseURL: 'http://127.0.0.1:9051',
        timeout: 5000
      });
      
      await torControl.post('/newnym');
      this.logger.info('Tor circuit renewed');
    } catch (error) {
      this.logger.error('Failed to renew Tor circuit', error);
    }
  }
}