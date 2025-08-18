import aiohttp
from typing import Dict, Any, List, Optional
from ..core.config import settings


class GooglePlacesClient:
    BASE = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    def __init__(self) -> None:
        self.api_key = settings.GOOGLE_MAPS_API_KEY

    async def text_search(self, query: str, pagetoken: Optional[str] = None) -> Dict[str, Any]:
        params = {"query": query, "key": self.api_key}
        if pagetoken:
            params["pagetoken"] = pagetoken
        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE, params=params, timeout=20) as resp:
                data = await resp.json()
                return data

    async def search_businesses(self, location: str, industry: Optional[str] = None, pages: int = 1) -> List[Dict[str, Any]]:
        q = f"{industry or 'businesses'} in {location}"
        results: List[Dict[str, Any]] = []
        token: Optional[str] = None
        for _ in range(max(1, pages)):
            data = await self.text_search(q, token)
            results.extend(data.get("results", []) or [])
            token = data.get("next_page_token")
            if not token:
                break
        return results





