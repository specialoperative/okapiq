import itertools
from typing import Optional, Dict


class ProxyManager:
    """
    Simple round-robin proxy manager.
    Accepts a comma-separated list of proxy URLs.
    Supports:
      - http://user:pass@host:port
      - http://host:port (with optional username/password provided separately)
    """

    def __init__(self, proxies_csv: str = "", username: Optional[str] = None, password: Optional[str] = None) -> None:
        self._proxies = [p.strip() for p in (proxies_csv or "").split(",") if p.strip()]
        self._username = username
        self._password = password
        self._cycle = itertools.cycle(self._proxies) if self._proxies else None

    def has_proxies(self) -> bool:
        return bool(self._proxies)

    def next_proxy_url(self) -> Optional[str]:
        if not self._cycle:
            return None
        return next(self._cycle)

    def aiohttp_kwargs(self) -> Dict:
        """Return kwargs for aiohttp request methods (e.g., {'proxy': 'http://...'})."""
        url = self.next_proxy_url()
        return {"proxy": url} if url else {}





