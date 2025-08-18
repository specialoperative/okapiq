import os
import logging
from typing import List, Dict, Optional, Tuple
import aiohttp
import time
from ..core.config import settings

class SimpleCache:
    def __init__(self, ttl_seconds: int = 600):
        self.ttl = ttl_seconds
        self.cache = {}
    def get(self, key: Tuple):
        entry = self.cache.get(key)
        if entry and (time.time() - entry['time'] < self.ttl):
            return entry['value']
        return None
    def set(self, key: Tuple, value):
        self.cache[key] = {'value': value, 'time': time.time()}

class CircuitBreaker:
    def __init__(self, max_failures: int = 3, reset_timeout: int = 300):
        self.max_failures = max_failures
        self.reset_timeout = reset_timeout
        self.failures = 0
        self.last_failure_time = 0
        self.tripped = False
    def call(self, func):
        async def wrapper(*args, **kwargs):
            if self.tripped and (time.time() - self.last_failure_time < self.reset_timeout):
                raise Exception("Circuit breaker tripped for SerpAPI")
            try:
                result = await func(*args, **kwargs)
                self.failures = 0
                self.tripped = False
                return result
            except Exception as e:
                self.failures += 1
                self.last_failure_time = time.time()
                if self.failures >= self.max_failures:
                    self.tripped = True
                raise e
        return wrapper

class SerpAPIClient:
    """Client for SerpAPI Places API (template, adjust endpoint/params as needed)"""
    BASE_URL = "https://serpapi.com/search.json"
    _cache = SimpleCache(ttl_seconds=600)
    _circuit_breaker = CircuitBreaker(max_failures=3, reset_timeout=300)

    def __init__(self):
        self.api_key = settings.SERPAPI_API_KEY

    @_circuit_breaker.call
    async def search_businesses(self, location: str, industry: Optional[str] = None, limit: int = 50) -> List[Dict]:
        cache_key = (location, industry)
        cached = self._cache.get(cache_key)
        if cached is not None:
            return cached
        params = {
            "engine": "google_maps",
            "q": industry or "businesses",
            "location": location,
            "type": "search",
            "api_key": self.api_key
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params) as resp:
                    if resp.status != 200:
                        logging.error(f"SerpAPI error: {resp.status}")
                        raise Exception(f"SerpAPI error: {resp.status}")
                    data = await resp.json()
                    results = data.get("local_results", [])
                    self._cache.set(cache_key, results)
                    return results
        except Exception as e:
            logging.error(f"SerpAPIClient error: {e}")
            raise e

    @_circuit_breaker.call
    async def search_raw(self, location: str, industry: Optional[str] = None) -> Dict:
        """Return the full SerpAPI JSON payload (not just local_results)."""
        params = {
            "engine": "google_maps",
            "q": industry or "businesses",
            "location": location,
            "type": "search",
            "api_key": self.api_key
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params) as resp:
                    if resp.status != 200:
                        logging.error(f"SerpAPI error: {resp.status}")
                        raise Exception(f"SerpAPI error: {resp.status}")
                    return await resp.json()
        except Exception as e:
            logging.error(f"SerpAPIClient error (raw): {e}")
            raise e
