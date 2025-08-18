import os
import logging
from typing import List, Dict, Optional
import aiohttp
from ..core.config import settings

class DataAxleAPI:
    """Client for Data Axle business data API (template, adjust endpoint/params as needed)"""
    BASE_URL = "https://api.data-axle.com/v1/businesses/search"  # Adjust to real endpoint

    def __init__(self):
        self.api_key = settings.DATA_AXLE_API_KEY

    async def search_businesses(self, location: str, industry: Optional[str] = None, limit: int = 50) -> List[Dict]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        params = {
            "location": location,
            "limit": limit
        }
        if industry:
            params["industry"] = industry
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, headers=headers, params=params) as resp:
                    if resp.status != 200:
                        logging.error(f"Data Axle API error: {resp.status}")
                        return []
                    data = await resp.json()
                    # Adjust this parsing to match Data Axle's real response structure
                    return data.get("businesses", [])
        except Exception as e:
            logging.error(f"DataAxleAPI error: {e}")
            return []

