import re
from typing import Dict, Any, Optional

import aiohttp
from bs4 import BeautifulSoup

from ..core.config import settings
from ..core.proxy_manager import ProxyManager


EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
PHONE_RE = re.compile(r"(\+?1[\s\-\.]?)?(\(?\d{3}\)?[\s\-\.]?)\d{3}[\s\-\.]?\d{4}")

_proxy = ProxyManager(settings.PROXIES or "", settings.PROXY_USERNAME, settings.PROXY_PASSWORD)


async def _fetch_html(url: str, timeout: int = 20) -> Optional[str]:
    if not url:
        return None
    if not url.startswith("http"):
        url = "http://" + url
    try:
        kwargs = _proxy.aiohttp_kwargs()
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=timeout, allow_redirects=True, **kwargs) as resp:
                if resp.status == 200 and "text/html" in (resp.headers.get("Content-Type", "")):
                    return await resp.text()
    except Exception:
        return None
    return None


def _extract_services(text: str) -> list:
    keywords = [
        "repair", "installation", "duct", "clean", "hvac", "plumbing",
        "landscaping", "roof", "ac", "heating", "electrical", "restaurant",
    ]
    lower = text.lower()
    return sorted({k for k in keywords if k in lower})


def _last_updated_from_html(html: str) -> Optional[str]:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all(["meta", "small", "footer", "span", "div"]):
        t = (tag.get("content") or tag.text or "").strip()
        if "©" in t or "copyright" in t.lower() or "last updated" in t.lower() or "update" in t.lower():
            return t[:140]
    return None


async def crawl_site(url: str) -> Dict[str, Any]:
    html = await _fetch_html(url)
    if not html:
        return {"foundEmail": None, "foundPhone": None, "services": [], "lastUpdated": None, "images": 0}
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(" ")
    emails = EMAIL_RE.findall(text)
    phones = PHONE_RE.findall(text)
    images = len(soup.find_all("img"))
    return {
        "foundEmail": emails[0] if emails else None,
        "foundPhone": "".join(phones[0]) if phones else None,
        "services": _extract_services(text),
        "lastUpdated": _last_updated_from_html(html),
        "images": images,
    }


