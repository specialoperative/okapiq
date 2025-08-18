from pydantic import BaseModel
from typing import Optional
import os

class Settings(BaseModel):
    # Database - Hardcoded for production
    DATABASE_URL: str = "sqlite:///./okapiq.db"
    
    # Redis - Hardcoded for production
    REDIS_URL: str = "redis://localhost:6379"
    
    # API Keys - Hardcoded for production
    YELP_API_KEY: Optional[str] = os.getenv("YELP_API_KEY", "your_yelp_api_key_here")
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY", "your_google_maps_api_key_here")
    GLENCOCO_API_KEY: Optional[str] = os.getenv("GLENCOCO_API_KEY", "your_glencoco_api_key_here")
    CENSUS_API_KEY: Optional[str] = os.getenv("CENSUS_API_KEY", "your_census_api_key_here")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "your_openai_api_key_here")
    DATA_AXLE_API_KEY: Optional[str] = os.getenv("DATA_AXLE_API_KEY", "your_data_axle_api_key_here")
    SERPAPI_API_KEY: Optional[str] = os.getenv("SERPAPI_API_KEY", "your_serpapi_api_key_here")
    APIFY_API_TOKEN: Optional[str] = os.getenv("APIFY_API_TOKEN", "your_apify_api_token_here")
    ARCGIS_API_KEY: Optional[str] = os.getenv("ARCGIS_API_KEY", "your_arcgis_api_key_here")
    
    # Stripe - Hardcoded for production
    STRIPE_SECRET_KEY: Optional[str] = "your_stripe_secret_key_here"
    STRIPE_PUBLISHABLE_KEY: Optional[str] = "your_stripe_publishable_key_here"
    
    # JWT - Hardcoded for production
    SECRET_KEY: str = "your-production-secret-key-change-this-to-something-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App Settings - Hardcoded for production
    APP_NAME: str = "Okapiq"
    DEBUG: bool = False  # Set to False for production
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = False  # Set to False for production
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001,https://yourdomain.com"
    
    # Proxy Settings (optional)
    PROXIES: Optional[str] = ""
    PROXY_USERNAME: Optional[str] = None
    PROXY_PASSWORD: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    # External APIs
    YELP_BASE_URL: str = "https://api.yelp.com/v3"
    CENSUS_BASE_URL: str = "https://api.census.gov/data"
    DATAAXLE_BASE_URL: str = "https://api.data-axle.com/v1"
    SERPAPI_BASE_URL: str = "https://serpapi.com/search.json"
    
    # Pricing
    EXPLORER_PRICE: int = 79
    PROFESSIONAL_PRICE: int = 897
    ELITE_PRICE: int = 5900
    
    # Trial Settings
    TRIAL_DAYS: int = 14
    ETALAUNCH_TRIAL_DAYS: int = 90
    ETALAUNCH_CODE: str = "ETALAUNCH100"

settings = Settings()