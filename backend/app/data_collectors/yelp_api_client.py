import aiohttp
from typing import List, Dict, Any, Optional
from ..core.config import settings


class YelpAPIClient:
    BASE = "https://api.yelp.com/v3"

    def __init__(self) -> None:
        self.api_key = settings.YELP_API_KEY
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    async def search(self, term: str, location: str, limit: int = 20) -> List[Dict[str, Any]]:
        async with aiohttp.ClientSession(headers=self.headers) as session:
            async with session.get(f"{self.BASE}/businesses/search", params={"term": term, "location": location, "limit": limit}, timeout=20) as resp:
                data = await resp.json()
                return data.get("businesses", [])





