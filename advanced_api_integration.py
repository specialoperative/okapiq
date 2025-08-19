#!/usr/bin/env python3
"""
🔗 Advanced API Integration Layer for Okapiq
Sophisticated multi-API orchestration with intelligent failover and optimization

FEATURES:
✅ Intelligent API routing and load balancing
✅ Advanced rate limiting with backoff strategies
✅ Automatic failover and circuit breaker patterns
✅ API response caching with smart invalidation
✅ Data fusion from multiple sources
✅ Quality scoring and source reliability tracking
✅ Cost optimization and usage monitoring
✅ Real-time API health monitoring
✅ Advanced error handling and retry logic
✅ Parallel processing with result aggregation
"""

import asyncio
import aiohttp
import logging
import json
import time
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union, Callable
from dataclasses import dataclass, asdict, field
from collections import defaultdict, deque
from enum import Enum
import random
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIStatus(Enum):
    """API status enumeration"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    DOWN = "down"
    RATE_LIMITED = "rate_limited"
    MAINTENANCE = "maintenance"

@dataclass
class APIEndpoint:
    """API endpoint configuration"""
    name: str
    base_url: str
    api_key: str
    rate_limit: int  # requests per minute
    timeout: int = 30
    retry_attempts: int = 3
    circuit_breaker_threshold: int = 5
    priority: int = 1  # 1=primary, 2=secondary, etc.
    cost_per_request: float = 0.0
    quality_score: float = 1.0

@dataclass
class APIResponse:
    """Standardized API response"""
    source: str
    success: bool
    data: Any
    response_time: float
    status_code: Optional[int] = None
    error_message: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.now)
    cached: bool = False

@dataclass
class APIMetrics:
    """API performance metrics"""
    endpoint_name: str
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    avg_response_time: float = 0.0
    rate_limit_hits: int = 0
    total_cost: float = 0.0
    last_request: Optional[datetime] = None
    current_status: APIStatus = APIStatus.HEALTHY

class CircuitBreaker:
    """Circuit breaker pattern implementation"""
    
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half_open
    
    def call(self, func: Callable, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        if self.state == "open":
            if self._should_attempt_reset():
                self.state = "half_open"
            else:
                raise Exception("Circuit breaker is open")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _should_attempt_reset(self) -> bool:
        """Check if circuit breaker should attempt reset"""
        if self.last_failure_time is None:
            return True
        
        return (datetime.now() - self.last_failure_time).seconds >= self.recovery_timeout
    
    def _on_success(self):
        """Handle successful request"""
        self.failure_count = 0
        self.state = "closed"
    
    def _on_failure(self):
        """Handle failed request"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "open"
            logger.warning(f"🔴 Circuit breaker opened after {self.failure_count} failures")

class RateLimiter:
    """Advanced rate limiter with multiple strategies"""
    
    def __init__(self, requests_per_minute: int, strategy: str = "sliding_window"):
        self.requests_per_minute = requests_per_minute
        self.strategy = strategy
        self.request_times = deque()
        self.lock = threading.Lock()
    
    def can_make_request(self) -> bool:
        """Check if request can be made"""
        with self.lock:
            now = datetime.now()
            cutoff_time = now - timedelta(minutes=1)
            
            # Remove old requests
            while self.request_times and self.request_times[0] < cutoff_time:
                self.request_times.popleft()
            
            return len(self.request_times) < self.requests_per_minute
    
    def record_request(self):
        """Record a new request"""
        with self.lock:
            self.request_times.append(datetime.now())
    
    def get_wait_time(self) -> float:
        """Get wait time until next request can be made"""
        if self.can_make_request():
            return 0.0
        
        # Calculate wait time based on oldest request
        if self.request_times:
            oldest_request = self.request_times[0]
            wait_until = oldest_request + timedelta(minutes=1)
            wait_seconds = (wait_until - datetime.now()).total_seconds()
            return max(0, wait_seconds)
        
        return 60.0  # Default wait time

class IntelligentCache:
    """Intelligent caching system with smart invalidation"""
    
    def __init__(self, max_size: int = 10000):
        self.cache = {}
        self.access_times = {}
        self.hit_counts = defaultdict(int)
        self.max_size = max_size
        self.lock = threading.Lock()
    
    def get(self, key: str, max_age: int = 3600) -> Optional[Any]:
        """Get cached value with age check"""
        with self.lock:
            if key not in self.cache:
                return None
            
            cached_item = self.cache[key]
            cache_time = cached_item.get('timestamp', datetime.min)
            
            # Check if cache is still valid
            if (datetime.now() - cache_time).seconds > max_age:
                del self.cache[key]
                return None
            
            # Update access statistics
            self.access_times[key] = datetime.now()
            self.hit_counts[key] += 1
            
            return cached_item['data']
    
    def set(self, key: str, value: Any, ttl: int = 3600):
        """Set cached value with TTL"""
        with self.lock:
            # Evict old items if cache is full
            if len(self.cache) >= self.max_size:
                self._evict_lru()
            
            self.cache[key] = {
                'data': value,
                'timestamp': datetime.now(),
                'ttl': ttl
            }
            self.access_times[key] = datetime.now()
    
    def _evict_lru(self):
        """Evict least recently used items"""
        if not self.access_times:
            return
        
        # Find least recently used key
        lru_key = min(self.access_times, key=self.access_times.get)
        
        # Remove from all structures
        self.cache.pop(lru_key, None)
        self.access_times.pop(lru_key, None)
        self.hit_counts.pop(lru_key, None)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = sum(self.hit_counts.values())
        cache_size = len(self.cache)
        
        return {
            "cache_size": cache_size,
            "total_requests": total_requests,
            "hit_rate": total_requests / max(1, cache_size),
            "most_accessed": dict(sorted(self.hit_counts.items(), 
                                       key=lambda x: x[1], reverse=True)[:5])
        }

class APIOrchestrator:
    """Advanced API orchestration with intelligent routing"""
    
    def __init__(self):
        self.endpoints: Dict[str, List[APIEndpoint]] = defaultdict(list)
        self.metrics: Dict[str, APIMetrics] = {}
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
        self.rate_limiters: Dict[str, RateLimiter] = {}
        self.cache = IntelligentCache()
        self.session_pool = {}
        
        # Initialize API endpoints
        self._initialize_endpoints()
    
    def _initialize_endpoints(self):
        """Initialize API endpoint configurations"""
        # Yelp API endpoints
        yelp_endpoints = [
            APIEndpoint("yelp_primary", "https://api.yelp.com/v3", 
                       os.getenv("YELP_API_KEY", ""), 5000, priority=1, cost_per_request=0.001),
            APIEndpoint("yelp_backup", "https://api.yelp.com/v3", 
                       os.getenv("YELP_API_KEY_BACKUP", ""), 5000, priority=2, cost_per_request=0.001)
        ]
        self.endpoints["yelp"] = yelp_endpoints
        
        # Google Maps API endpoints
        gmaps_endpoints = [
            APIEndpoint("gmaps_primary", "https://maps.googleapis.com/maps/api", 
                       os.getenv("GOOGLE_MAPS_API_KEY", ""), 1000, priority=1, cost_per_request=0.005),
            APIEndpoint("gmaps_backup", "https://maps.googleapis.com/maps/api", 
                       os.getenv("GOOGLE_MAPS_API_KEY_BACKUP", ""), 1000, priority=2, cost_per_request=0.005)
        ]
        self.endpoints["gmaps"] = gmaps_endpoints
        
        # Census API endpoints
        census_endpoints = [
            APIEndpoint("census_primary", "https://api.census.gov/data", 
                       os.getenv("CENSUS_API_KEY", ""), 500, priority=1, cost_per_request=0.0)
        ]
        self.endpoints["census"] = census_endpoints
        
        # OpenAI API endpoints
        openai_endpoints = [
            APIEndpoint("openai_primary", "https://api.openai.com/v1", 
                       os.getenv("OPENAI_API_KEY", ""), 60, priority=1, cost_per_request=0.02)
        ]
        self.endpoints["openai"] = openai_endpoints
        
        # Initialize supporting components for each endpoint
        for service, endpoint_list in self.endpoints.items():
            for endpoint in endpoint_list:
                self.metrics[endpoint.name] = APIMetrics(endpoint.name)
                self.circuit_breakers[endpoint.name] = CircuitBreaker(endpoint.circuit_breaker_threshold)
                self.rate_limiters[endpoint.name] = RateLimiter(endpoint.rate_limit)
    
    async def make_request(self, service: str, endpoint_path: str, 
                          params: Dict = None, data: Dict = None, 
                          method: str = "GET", cache_ttl: int = 3600) -> APIResponse:
        """Make intelligent API request with failover"""
        
        # Check cache first
        cache_key = self._generate_cache_key(service, endpoint_path, params, data)
        cached_response = self.cache.get(cache_key, cache_ttl)
        
        if cached_response:
            logger.info(f"📦 Cache hit for {service}/{endpoint_path}")
            return APIResponse(
                source=f"{service}_cache",
                success=True,
                data=cached_response,
                response_time=0.0,
                cached=True
            )
        
        # Get available endpoints for service
        available_endpoints = self.endpoints.get(service, [])
        if not available_endpoints:
            return APIResponse(
                source=service,
                success=False,
                data=None,
                response_time=0.0,
                error_message=f"No endpoints configured for {service}"
            )
        
        # Sort by priority and health
        sorted_endpoints = sorted(available_endpoints, 
                                key=lambda ep: (ep.priority, self._get_endpoint_health_score(ep.name)))
        
        # Try endpoints in order
        for endpoint in sorted_endpoints:
            try:
                # Check circuit breaker
                if self.circuit_breakers[endpoint.name].state == "open":
                    logger.warning(f"⚠️ Circuit breaker open for {endpoint.name}")
                    continue
                
                # Check rate limiting
                rate_limiter = self.rate_limiters[endpoint.name]
                if not rate_limiter.can_make_request():
                    wait_time = rate_limiter.get_wait_time()
                    logger.warning(f"⏱️ Rate limited for {endpoint.name}, wait: {wait_time:.1f}s")
                    
                    if wait_time > 30:  # Don't wait too long
                        continue
                    else:
                        await asyncio.sleep(wait_time)
                
                # Make the request
                response = await self._make_http_request(endpoint, endpoint_path, params, data, method)
                
                # Update metrics
                self._update_metrics(endpoint.name, response)
                
                # Cache successful responses
                if response.success and cache_ttl > 0:
                    self.cache.set(cache_key, response.data, cache_ttl)
                
                return response
                
            except Exception as e:
                logger.error(f"❌ Error with {endpoint.name}: {e}")
                self._update_metrics(endpoint.name, None, error=str(e))
                continue
        
        # All endpoints failed
        return APIResponse(
            source=service,
            success=False,
            data=None,
            response_time=0.0,
            error_message=f"All {service} endpoints failed"
        )
    
    async def _make_http_request(self, endpoint: APIEndpoint, path: str, 
                                params: Dict = None, data: Dict = None, 
                                method: str = "GET") -> APIResponse:
        """Make HTTP request to specific endpoint"""
        start_time = time.time()
        
        # Prepare request
        url = f"{endpoint.base_url.rstrip('/')}/{path.lstrip('/')}"
        headers = {
            "Authorization": f"Bearer {endpoint.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Okapiq/2.0 (Business Intelligence Platform)"
        }
        
        # Get or create session
        session = await self._get_session(endpoint.name)
        
        try:
            # Make request with circuit breaker protection
            response_data = await self.circuit_breakers[endpoint.name].call(
                self._execute_request, session, method, url, headers, params, data, endpoint.timeout
            )
            
            # Record successful request
            self.rate_limiters[endpoint.name].record_request()
            
            return APIResponse(
                source=endpoint.name,
                success=True,
                data=response_data,
                response_time=time.time() - start_time,
                status_code=200
            )
            
        except Exception as e:
            return APIResponse(
                source=endpoint.name,
                success=False,
                data=None,
                response_time=time.time() - start_time,
                error_message=str(e)
            )
    
    async def _execute_request(self, session: aiohttp.ClientSession, method: str, 
                              url: str, headers: Dict, params: Dict, 
                              data: Dict, timeout: int) -> Any:
        """Execute the actual HTTP request"""
        timeout_config = aiohttp.ClientTimeout(total=timeout)
        
        async with session.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=data,
            timeout=timeout_config
        ) as response:
            response.raise_for_status()
            return await response.json()
    
    async def _get_session(self, endpoint_name: str) -> aiohttp.ClientSession:
        """Get or create aiohttp session for endpoint"""
        if endpoint_name not in self.session_pool:
            connector = aiohttp.TCPConnector(limit=100, limit_per_host=30)
            self.session_pool[endpoint_name] = aiohttp.ClientSession(connector=connector)
        
        return self.session_pool[endpoint_name]
    
    def _generate_cache_key(self, service: str, path: str, 
                           params: Dict = None, data: Dict = None) -> str:
        """Generate cache key for request"""
        key_components = [service, path]
        
        if params:
            key_components.append(json.dumps(params, sort_keys=True))
        if data:
            key_components.append(json.dumps(data, sort_keys=True))
        
        key_string = "|".join(key_components)
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _update_metrics(self, endpoint_name: str, response: Optional[APIResponse], error: str = None):
        """Update endpoint metrics"""
        metrics = self.metrics[endpoint_name]
        metrics.total_requests += 1
        metrics.last_request = datetime.now()
        
        if response and response.success:
            metrics.successful_requests += 1
            # Update average response time
            total_successful = metrics.successful_requests
            metrics.avg_response_time = (
                (metrics.avg_response_time * (total_successful - 1) + response.response_time) / total_successful
            )
        else:
            metrics.failed_requests += 1
        
        # Update status based on recent performance
        success_rate = metrics.successful_requests / metrics.total_requests
        if success_rate < 0.5:
            metrics.current_status = APIStatus.DOWN
        elif success_rate < 0.8:
            metrics.current_status = APIStatus.DEGRADED
        elif error and "rate limit" in error.lower():
            metrics.current_status = APIStatus.RATE_LIMITED
        else:
            metrics.current_status = APIStatus.HEALTHY
    
    def _get_endpoint_health_score(self, endpoint_name: str) -> float:
        """Calculate health score for endpoint prioritization"""
        metrics = self.metrics[endpoint_name]
        
        if metrics.total_requests == 0:
            return 1.0  # New endpoint, assume healthy
        
        success_rate = metrics.successful_requests / metrics.total_requests
        response_time_score = max(0, 1 - metrics.avg_response_time / 10)  # Penalize slow responses
        
        # Circuit breaker penalty
        cb_penalty = 0.5 if self.circuit_breakers[endpoint_name].state == "open" else 0
        
        return max(0, success_rate * 0.7 + response_time_score * 0.3 - cb_penalty)
    
    async def parallel_requests(self, requests: List[Dict]) -> List[APIResponse]:
        """Execute multiple API requests in parallel"""
        tasks = []
        
        for req in requests:
            task = self.make_request(
                service=req["service"],
                endpoint_path=req["path"],
                params=req.get("params"),
                data=req.get("data"),
                method=req.get("method", "GET"),
                cache_ttl=req.get("cache_ttl", 3600)
            )
            tasks.append(task)
        
        # Execute all requests concurrently
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        processed_responses = []
        for i, response in enumerate(responses):
            if isinstance(response, Exception):
                error_response = APIResponse(
                    source=requests[i]["service"],
                    success=False,
                    data=None,
                    response_time=0.0,
                    error_message=str(response)
                )
                processed_responses.append(error_response)
            else:
                processed_responses.append(response)
        
        return processed_responses
    
    def get_api_status_report(self) -> Dict[str, Any]:
        """Get comprehensive API status report"""
        report = {
            "services": {},
            "overall_health": "healthy",
            "total_requests": 0,
            "total_cost": 0.0,
            "cache_stats": self.cache.get_stats(),
            "timestamp": datetime.now().isoformat()
        }
        
        unhealthy_count = 0
        
        for service, endpoint_list in self.endpoints.items():
            service_metrics = {
                "endpoints": [],
                "total_requests": 0,
                "avg_success_rate": 0.0,
                "avg_response_time": 0.0,
                "status": "healthy"
            }
            
            for endpoint in endpoint_list:
                metrics = self.metrics[endpoint.name]
                endpoint_data = {
                    "name": endpoint.name,
                    "status": metrics.current_status.value,
                    "success_rate": metrics.successful_requests / max(1, metrics.total_requests),
                    "avg_response_time": metrics.avg_response_time,
                    "total_requests": metrics.total_requests,
                    "total_cost": metrics.total_cost,
                    "health_score": self._get_endpoint_health_score(endpoint.name)
                }
                
                service_metrics["endpoints"].append(endpoint_data)
                service_metrics["total_requests"] += metrics.total_requests
                report["total_requests"] += metrics.total_requests
                report["total_cost"] += metrics.total_cost
                
                if metrics.current_status != APIStatus.HEALTHY:
                    unhealthy_count += 1
            
            # Calculate service-level metrics
            if service_metrics["endpoints"]:
                service_metrics["avg_success_rate"] = np.mean([ep["success_rate"] for ep in service_metrics["endpoints"]])
                service_metrics["avg_response_time"] = np.mean([ep["avg_response_time"] for ep in service_metrics["endpoints"]])
                
                # Determine service status
                if service_metrics["avg_success_rate"] < 0.5:
                    service_metrics["status"] = "down"
                elif service_metrics["avg_success_rate"] < 0.8:
                    service_metrics["status"] = "degraded"
            
            report["services"][service] = service_metrics
        
        # Determine overall health
        total_endpoints = sum(len(endpoint_list) for endpoint_list in self.endpoints.values())
        if unhealthy_count > total_endpoints * 0.5:
            report["overall_health"] = "critical"
        elif unhealthy_count > total_endpoints * 0.2:
            report["overall_health"] = "degraded"
        
        return report

class DataFusionEngine:
    """Advanced data fusion from multiple API sources"""
    
    def __init__(self, orchestrator: APIOrchestrator):
        self.orchestrator = orchestrator
        self.fusion_strategies = {
            "business_search": self._fuse_business_search_data,
            "market_analysis": self._fuse_market_analysis_data,
            "demographic_data": self._fuse_demographic_data
        }
    
    async def fuse_business_data(self, business_name: str, location: str) -> Dict[str, Any]:
        """Fuse business data from multiple sources"""
        logger.info(f"🔄 Fusing business data for {business_name} in {location}")
        
        # Prepare parallel requests
        requests = [
            {
                "service": "yelp",
                "path": "businesses/search",
                "params": {"term": business_name, "location": location, "limit": 10},
                "cache_ttl": 1800
            },
            {
                "service": "gmaps",
                "path": "place/textsearch/json",
                "params": {"query": f"{business_name} {location}", "type": "establishment"},
                "cache_ttl": 1800
            }
        ]
        
        # Execute requests in parallel
        responses = await self.orchestrator.parallel_requests(requests)
        
        # Fuse the data
        fused_data = await self._fuse_business_search_data(responses, business_name, location)
        
        return fused_data
    
    async def _fuse_business_search_data(self, responses: List[APIResponse], 
                                       business_name: str, location: str) -> Dict[str, Any]:
        """Fuse business search data from multiple sources"""
        fused_result = {
            "business_name": business_name,
            "location": location,
            "sources": [],
            "confidence_score": 0.0,
            "data": {},
            "quality_metrics": {}
        }
        
        yelp_data = None
        gmaps_data = None
        
        # Extract data from responses
        for response in responses:
            if response.success:
                fused_result["sources"].append(response.source)
                
                if "yelp" in response.source:
                    yelp_data = response.data
                elif "gmaps" in response.source:
                    gmaps_data = response.data
        
        # Fuse Yelp data
        if yelp_data and yelp_data.get("businesses"):
            best_yelp_match = self._find_best_match(yelp_data["businesses"], business_name)
            if best_yelp_match:
                fused_result["data"]["yelp"] = {
                    "name": best_yelp_match.get("name"),
                    "rating": best_yelp_match.get("rating"),
                    "review_count": best_yelp_match.get("review_count"),
                    "phone": best_yelp_match.get("phone"),
                    "address": best_yelp_match.get("location", {}).get("display_address"),
                    "categories": [cat["title"] for cat in best_yelp_match.get("categories", [])]
                }
                fused_result["confidence_score"] += 0.4
        
        # Fuse Google Maps data
        if gmaps_data and gmaps_data.get("results"):
            best_gmaps_match = self._find_best_match(gmaps_data["results"], business_name)
            if best_gmaps_match:
                fused_result["data"]["google_maps"] = {
                    "name": best_gmaps_match.get("name"),
                    "rating": best_gmaps_match.get("rating"),
                    "user_ratings_total": best_gmaps_match.get("user_ratings_total"),
                    "formatted_address": best_gmaps_match.get("formatted_address"),
                    "place_id": best_gmaps_match.get("place_id"),
                    "types": best_gmaps_match.get("types", [])
                }
                fused_result["confidence_score"] += 0.4
        
        # Cross-validate data
        validation_score = self._cross_validate_business_data(fused_result["data"])
        fused_result["confidence_score"] += validation_score * 0.2
        
        # Calculate quality metrics
        fused_result["quality_metrics"] = self._calculate_data_quality(fused_result["data"])
        
        return fused_result
    
    def _find_best_match(self, candidates: List[Dict], target_name: str) -> Optional[Dict]:
        """Find best matching business from candidates"""
        if not candidates:
            return None
        
        # Simple name matching (in production, use fuzzy matching)
        target_lower = target_name.lower()
        
        best_match = None
        best_score = 0
        
        for candidate in candidates:
            candidate_name = candidate.get("name", "").lower()
            
            # Calculate similarity score
            similarity = self._calculate_name_similarity(target_lower, candidate_name)
            
            if similarity > best_score:
                best_score = similarity
                best_match = candidate
        
        return best_match if best_score > 0.5 else None
    
    def _calculate_name_similarity(self, name1: str, name2: str) -> float:
        """Calculate name similarity score"""
        # Simple word overlap similarity
        words1 = set(name1.split())
        words2 = set(name2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def _cross_validate_business_data(self, data: Dict[str, Any]) -> float:
        """Cross-validate data from multiple sources"""
        validation_score = 0.0
        
        yelp_data = data.get("yelp", {})
        gmaps_data = data.get("google_maps", {})
        
        # Name consistency
        if yelp_data.get("name") and gmaps_data.get("name"):
            name_similarity = self._calculate_name_similarity(
                yelp_data["name"].lower(), gmaps_data["name"].lower()
            )
            validation_score += name_similarity * 0.3
        
        # Phone consistency
        if yelp_data.get("phone") and gmaps_data.get("phone"):
            if yelp_data["phone"] == gmaps_data["phone"]:
                validation_score += 0.3
        
        # Address consistency
        if yelp_data.get("address") and gmaps_data.get("formatted_address"):
            # Simple address matching
            addr1 = " ".join(yelp_data["address"]).lower() if isinstance(yelp_data["address"], list) else str(yelp_data["address"]).lower()
            addr2 = gmaps_data["formatted_address"].lower()
            
            if any(word in addr2 for word in addr1.split() if len(word) > 3):
                validation_score += 0.2
        
        # Rating consistency
        if yelp_data.get("rating") and gmaps_data.get("rating"):
            rating_diff = abs(yelp_data["rating"] - gmaps_data["rating"])
            if rating_diff <= 0.5:
                validation_score += 0.2
        
        return min(validation_score, 1.0)
    
    def _calculate_data_quality(self, data: Dict[str, Any]) -> Dict[str, float]:
        """Calculate data quality metrics"""
        quality_metrics = {
            "completeness": 0.0,
            "accuracy": 0.0,
            "consistency": 0.0,
            "timeliness": 0.0
        }
        
        # Completeness: How much data we have
        total_fields = 0
        filled_fields = 0
        
        for source, source_data in data.items():
            for field, value in source_data.items():
                total_fields += 1
                if value is not None and value != "":
                    filled_fields += 1
        
        quality_metrics["completeness"] = filled_fields / max(1, total_fields)
        
        # Accuracy: Based on cross-validation
        quality_metrics["accuracy"] = self._cross_validate_business_data(data)
        
        # Consistency: How consistent data is across sources
        quality_metrics["consistency"] = quality_metrics["accuracy"]  # Simplified
        
        # Timeliness: How recent the data is (assume current for API data)
        quality_metrics["timeliness"] = 1.0
        
        return quality_metrics
    
    async def _fuse_market_analysis_data(self, responses: List[APIResponse]) -> Dict[str, Any]:
        """Fuse market analysis data"""
        # Implementation for market analysis data fusion
        return {"status": "not_implemented"}
    
    async def _fuse_demographic_data(self, responses: List[APIResponse]) -> Dict[str, Any]:
        """Fuse demographic data"""
        # Implementation for demographic data fusion
        return {"status": "not_implemented"}

class AdvancedAPIManager:
    """Main API management class"""
    
    def __init__(self):
        self.orchestrator = APIOrchestrator()
        self.fusion_engine = DataFusionEngine(self.orchestrator)
        self.performance_monitor = self._setup_performance_monitoring()
        
        logger.info("🚀 Advanced API Manager initialized")
    
    def _setup_performance_monitoring(self):
        """Setup performance monitoring"""
        # In production, integrate with monitoring services
        return {
            "enabled": True,
            "metrics_collected": ["response_time", "success_rate", "cost", "quality_score"],
            "alert_thresholds": {
                "response_time": 5.0,
                "success_rate": 0.8,
                "cost_per_hour": 10.0
            }
        }
    
    async def search_businesses(self, query: str, location: str, 
                              sources: List[str] = None) -> Dict[str, Any]:
        """Search businesses using multiple APIs with intelligent fusion"""
        if sources is None:
            sources = ["yelp", "gmaps"]
        
        start_time = time.time()
        
        # Execute parallel searches
        search_requests = []
        for source in sources:
            if source == "yelp":
                search_requests.append({
                    "service": "yelp",
                    "path": "businesses/search",
                    "params": {"term": query, "location": location, "limit": 20}
                })
            elif source == "gmaps":
                search_requests.append({
                    "service": "gmaps",
                    "path": "place/textsearch/json",
                    "params": {"query": f"{query} {location}", "type": "establishment"}
                })
        
        responses = await self.orchestrator.parallel_requests(search_requests)
        
        # Fuse results
        fused_data = await self.fusion_engine.fuse_business_data(query, location)
        
        # Add performance metrics
        fused_data["performance"] = {
            "total_time": time.time() - start_time,
            "sources_queried": len(search_requests),
            "successful_sources": sum(1 for r in responses if r.success),
            "cache_hits": sum(1 for r in responses if r.cached)
        }
        
        return fused_data
    
    async def get_comprehensive_market_data(self, industry: str, location: str) -> Dict[str, Any]:
        """Get comprehensive market data using all available APIs"""
        logger.info(f"📊 Getting comprehensive market data for {industry} in {location}")
        
        # Prepare comprehensive request set
        requests = [
            {"service": "yelp", "path": "businesses/search", 
             "params": {"categories": industry, "location": location, "limit": 50}},
            {"service": "census", "path": "2021/acs/acs1/profile", 
             "params": {"get": "DP02_0001E,DP03_0062E", "for": "place:*", "in": f"state:{location[:2]}"}},
            {"service": "gmaps", "path": "place/textsearch/json", 
             "params": {"query": f"{industry} {location}", "type": "establishment"}}
        ]
        
        responses = await self.orchestrator.parallel_requests(requests)
        
        # Process and combine results
        combined_data = {
            "industry": industry,
            "location": location,
            "data_sources": [],
            "businesses": [],
            "market_metrics": {},
            "demographic_data": {},
            "analysis_timestamp": datetime.now().isoformat()
        }
        
        for response in responses:
            if response.success:
                combined_data["data_sources"].append(response.source)
                
                if "yelp" in response.source:
                    combined_data["businesses"].extend(
                        self._process_yelp_businesses(response.data.get("businesses", []))
                    )
                elif "census" in response.source:
                    combined_data["demographic_data"] = self._process_census_data(response.data)
                elif "gmaps" in response.source:
                    combined_data["businesses"].extend(
                        self._process_gmaps_businesses(response.data.get("results", []))
                    )
        
        # Calculate market metrics
        combined_data["market_metrics"] = self._calculate_market_metrics(combined_data["businesses"])
        
        return combined_data
    
    def _process_yelp_businesses(self, businesses: List[Dict]) -> List[Dict]:
        """Process Yelp business data"""
        processed = []
        for business in businesses:
            processed_business = {
                "source": "yelp",
                "name": business.get("name"),
                "rating": business.get("rating"),
                "review_count": business.get("review_count"),
                "phone": business.get("phone"),
                "address": business.get("location", {}).get("display_address"),
                "categories": [cat["title"] for cat in business.get("categories", [])],
                "price_range": business.get("price"),
                "coordinates": business.get("coordinates", {})
            }
            processed.append(processed_business)
        
        return processed
    
    def _process_gmaps_businesses(self, businesses: List[Dict]) -> List[Dict]:
        """Process Google Maps business data"""
        processed = []
        for business in businesses:
            processed_business = {
                "source": "google_maps",
                "name": business.get("name"),
                "rating": business.get("rating"),
                "user_ratings_total": business.get("user_ratings_total"),
                "formatted_address": business.get("formatted_address"),
                "place_id": business.get("place_id"),
                "types": business.get("types", []),
                "geometry": business.get("geometry", {})
            }
            processed.append(processed_business)
        
        return processed
    
    def _process_census_data(self, census_data: Any) -> Dict[str, Any]:
        """Process Census API data"""
        # Simplified census data processing
        return {
            "population": census_data.get("population", "unknown"),
            "median_income": census_data.get("median_income", "unknown"),
            "source": "us_census"
        }
    
    def _calculate_market_metrics(self, businesses: List[Dict]) -> Dict[str, Any]:
        """Calculate market metrics from business data"""
        if not businesses:
            return {"error": "No business data available"}
        
        # Basic metrics
        total_businesses = len(businesses)
        avg_rating = np.mean([b.get("rating", 0) for b in businesses if b.get("rating")])
        
        # Source distribution
        source_counts = defaultdict(int)
        for business in businesses:
            source_counts[business.get("source", "unknown")] += 1
        
        return {
            "total_businesses": total_businesses,
            "average_rating": avg_rating,
            "source_distribution": dict(source_counts),
            "market_density": "high" if total_businesses > 20 else "medium" if total_businesses > 10 else "low",
            "data_coverage": len(source_counts) / 3  # Assuming 3 main sources
        }
    
    async def close_sessions(self):
        """Close all HTTP sessions"""
        for session in self.orchestrator.session_pool.values():
            await session.close()

# Example usage and testing
async def main():
    """Test the advanced API integration"""
    api_manager = AdvancedAPIManager()
    
    try:
        print("🧪 Testing advanced API integration...")
        
        # Test business search
        business_result = await api_manager.search_businesses(
            query="accounting services",
            location="Boston, MA"
        )
        print(f"✅ Business search: {len(business_result.get('data', {}))} sources")
        
        # Test comprehensive market data
        market_result = await api_manager.get_comprehensive_market_data(
            industry="accounting",
            location="Boston, MA"
        )
        print(f"📊 Market data: {len(market_result.get('businesses', []))} businesses found")
        
        # Get API status report
        status_report = api_manager.orchestrator.get_api_status_report()
        print(f"📡 API Status: {status_report['overall_health']}")
        print(f"💰 Total Cost: ${status_report['total_cost']:.4f}")
        
        print("✅ Advanced API integration testing completed!")
        
    finally:
        await api_manager.close_sessions()

if __name__ == "__main__":
    asyncio.run(main())
