#!/usr/bin/env python3
"""
Performance monitoring and logging for the business intelligence pipeline
Tracks API usage, errors, enrichment coverage, and system health
"""

import time
import logging
import json
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from collections import defaultdict
import asyncio

@dataclass
class APIUsageStats:
    """Track API usage statistics"""
    total_calls: int = 0
    successful_calls: int = 0
    failed_calls: int = 0
    total_response_time: float = 0.0
    cache_hits: int = 0
    cache_misses: int = 0
    last_error: Optional[str] = None
    last_error_time: Optional[datetime] = None
    
    @property
    def success_rate(self) -> float:
        """Calculate API success rate"""
        if self.total_calls == 0:
            return 0.0
        return (self.successful_calls / self.total_calls) * 100
    
    @property
    def avg_response_time(self) -> float:
        """Calculate average response time"""
        if self.successful_calls == 0:
            return 0.0
        return self.total_response_time / self.successful_calls
    
    @property
    def cache_hit_rate(self) -> float:
        """Calculate cache hit rate"""
        total_cache_requests = self.cache_hits + self.cache_misses
        if total_cache_requests == 0:
            return 0.0
        return (self.cache_hits / total_cache_requests) * 100


@dataclass
class EnrichmentCoverage:
    """Track data enrichment coverage"""
    total_businesses: int = 0
    census_enriched: int = 0
    irs_enriched: int = 0
    sos_enriched: int = 0
    nlp_enriched: int = 0
    market_intelligence_enriched: int = 0
    
    @property
    def overall_coverage(self) -> float:
        """Calculate overall enrichment coverage percentage"""
        if self.total_businesses == 0:
            return 0.0
        total_enrichments = (self.census_enriched + self.irs_enriched + 
                           self.sos_enriched + self.nlp_enriched + 
                           self.market_intelligence_enriched)
        max_possible = self.total_businesses * 5  # 5 enrichment types
        return (total_enrichments / max_possible) * 100


class PerformanceMonitor:
    """
    Monitor and log performance metrics for the business intelligence pipeline
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.api_stats: Dict[str, APIUsageStats] = defaultdict(APIUsageStats)
        self.enrichment_coverage = EnrichmentCoverage()
        self.start_time = datetime.now()
        
        # Configure structured logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    def log_api_call(self, api_name: str, success: bool, response_time: float, 
                     error_message: Optional[str] = None, cached: bool = False):
        """Log an API call with performance metrics"""
        stats = self.api_stats[api_name]
        stats.total_calls += 1
        
        if success:
            stats.successful_calls += 1
            stats.total_response_time += response_time
        else:
            stats.failed_calls += 1
            stats.last_error = error_message
            stats.last_error_time = datetime.now()
        
        if cached:
            stats.cache_hits += 1
        else:
            stats.cache_misses += 1
        
        # Log the event
        log_data = {
            "api_name": api_name,
            "success": success,
            "response_time": response_time,
            "cached": cached,
            "timestamp": datetime.now().isoformat()
        }
        
        if error_message:
            log_data["error"] = error_message
        
        if success:
            self.logger.info(f"API call successful: {json.dumps(log_data)}")
        else:
            self.logger.error(f"API call failed: {json.dumps(log_data)}")
    
    def log_enrichment(self, enrichment_type: str, business_count: int, successful_count: int):
        """Log enrichment operation results"""
        self.enrichment_coverage.total_businesses = max(
            self.enrichment_coverage.total_businesses, 
            business_count
        )
        
        # Update specific enrichment counts
        if enrichment_type == "census":
            self.enrichment_coverage.census_enriched += successful_count
        elif enrichment_type == "irs":
            self.enrichment_coverage.irs_enriched += successful_count
        elif enrichment_type == "sos":
            self.enrichment_coverage.sos_enriched += successful_count
        elif enrichment_type == "nlp":
            self.enrichment_coverage.nlp_enriched += successful_count
        elif enrichment_type == "market_intelligence":
            self.enrichment_coverage.market_intelligence_enriched += successful_count
        
        # Log enrichment event
        log_data = {
            "enrichment_type": enrichment_type,
            "business_count": business_count,
            "successful_count": successful_count,
            "success_rate": (successful_count / business_count) * 100 if business_count > 0 else 0,
            "timestamp": datetime.now().isoformat()
        }
        
        self.logger.info(f"Enrichment completed: {json.dumps(log_data)}")
    
    def log_market_scan(self, location: str, industry: str, business_count: int, 
                       processing_time: float, data_sources: Dict[str, int]):
        """Log market scan operation"""
        log_data = {
            "operation": "market_scan",
            "location": location,
            "industry": industry,
            "business_count": business_count,
            "processing_time": processing_time,
            "data_sources": data_sources,
            "timestamp": datetime.now().isoformat()
        }
        
        self.logger.info(f"Market scan completed: {json.dumps(log_data)}")
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get a comprehensive performance summary"""
        uptime = datetime.now() - self.start_time
        
        # API performance summary
        api_summary = {}
        for api_name, stats in self.api_stats.items():
            api_summary[api_name] = {
                "total_calls": stats.total_calls,
                "success_rate": round(stats.success_rate, 2),
                "avg_response_time": round(stats.avg_response_time, 3),
                "cache_hit_rate": round(stats.cache_hit_rate, 2),
                "last_error": stats.last_error,
                "last_error_time": stats.last_error_time.isoformat() if stats.last_error_time else None
            }
        
        return {
            "system_uptime": str(uptime),
            "api_performance": api_summary,
            "enrichment_coverage": {
                "total_businesses": self.enrichment_coverage.total_businesses,
                "overall_coverage": round(self.enrichment_coverage.overall_coverage, 2),
                "census_coverage": round((self.enrichment_coverage.census_enriched / max(self.enrichment_coverage.total_businesses, 1)) * 100, 2),
                "irs_coverage": round((self.enrichment_coverage.irs_enriched / max(self.enrichment_coverage.total_businesses, 1)) * 100, 2),
                "sos_coverage": round((self.enrichment_coverage.sos_enriched / max(self.enrichment_coverage.total_businesses, 1)) * 100, 2),
                "nlp_coverage": round((self.enrichment_coverage.nlp_enriched / max(self.enrichment_coverage.total_businesses, 1)) * 100, 2),
                "market_intelligence_coverage": round((self.enrichment_coverage.market_intelligence_enriched / max(self.enrichment_coverage.total_businesses, 1)) * 100, 2)
            },
            "generated_at": datetime.now().isoformat()
        }
    
    def log_system_health(self):
        """Log periodic system health metrics"""
        summary = self.get_performance_summary()
        self.logger.info(f"System health check: {json.dumps(summary)}")
    
    async def start_health_monitoring(self, interval_minutes: int = 30):
        """Start periodic health monitoring"""
        while True:
            await asyncio.sleep(interval_minutes * 60)
            self.log_system_health()


# Global performance monitor instance
performance_monitor = PerformanceMonitor()


def monitor_api_call(api_name: str):
    """Decorator to monitor API calls"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                response_time = time.time() - start_time
                performance_monitor.log_api_call(api_name, True, response_time)
                return result
            except Exception as e:
                response_time = time.time() - start_time
                performance_monitor.log_api_call(api_name, False, response_time, str(e))
                raise
        return wrapper
    return decorator


def monitor_enrichment(enrichment_type: str):
    """Decorator to monitor enrichment operations"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            try:
                result = await func(*args, **kwargs)
                # Count successful enrichments (assuming result is a list or has success indicators)
                if isinstance(result, list):
                    business_count = len(args[1]) if len(args) > 1 else len(result)
                    successful_count = len([r for r in result if r])
                else:
                    business_count = 1
                    successful_count = 1 if result else 0
                
                performance_monitor.log_enrichment(enrichment_type, business_count, successful_count)
                return result
            except Exception as e:
                # Log failed enrichment
                business_count = len(args[1]) if len(args) > 1 else 1
                performance_monitor.log_enrichment(enrichment_type, business_count, 0)
                raise
        return wrapper
    return decorator

