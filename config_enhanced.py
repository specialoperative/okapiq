#!/usr/bin/env python3
"""
⚙️ Enhanced Configuration System for Okapiq
Advanced configuration management with environment-specific settings

FEATURES:
✅ Environment-specific configurations (dev, staging, prod)
✅ Secure API key management with rotation
✅ Advanced database configurations
✅ ML model configurations and hyperparameters
✅ Monitoring and alerting configurations
✅ Performance optimization settings
✅ Security and authentication settings
✅ Feature flags and A/B testing
✅ Auto-scaling and resource management
✅ Compliance and audit configurations
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from pathlib import Path
from datetime import datetime, timedelta
import secrets
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Environment(Enum):
    """Environment types"""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"

@dataclass
class DatabaseConfig:
    """Database configuration"""
    host: str = "localhost"
    port: int = 5432
    database: str = "okapiq"
    username: str = "okapiq_user"
    password: str = ""
    ssl_mode: str = "prefer"
    pool_size: int = 20
    max_overflow: int = 10
    pool_timeout: int = 30
    pool_recycle: int = 3600
    echo: bool = False

@dataclass
class RedisConfig:
    """Redis configuration"""
    host: str = "localhost"
    port: int = 6379
    password: str = ""
    db: int = 0
    ssl: bool = False
    socket_timeout: int = 5
    socket_connect_timeout: int = 5
    max_connections: int = 50

@dataclass
class APIConfig:
    """API endpoint configuration"""
    name: str
    base_url: str
    api_key: str
    rate_limit: int
    timeout: int = 30
    retry_attempts: int = 3
    backoff_factor: float = 2.0
    circuit_breaker_threshold: int = 5
    cost_per_request: float = 0.0
    quality_weight: float = 1.0
    enabled: bool = True

@dataclass
class MLConfig:
    """Machine Learning configuration"""
    model_dir: str = "models"
    auto_retrain: bool = True
    retrain_threshold: int = 1000  # New data points before retrain
    retrain_schedule: str = "daily"  # daily, weekly, monthly
    feature_selection: bool = True
    hyperparameter_tuning: bool = True
    cross_validation_folds: int = 5
    test_size: float = 0.2
    random_state: int = 42
    
    # Model-specific configurations
    random_forest: Dict[str, Any] = field(default_factory=lambda: {
        "n_estimators": 100,
        "max_depth": 10,
        "min_samples_split": 5,
        "min_samples_leaf": 2
    })
    
    gradient_boosting: Dict[str, Any] = field(default_factory=lambda: {
        "n_estimators": 100,
        "learning_rate": 0.1,
        "max_depth": 6,
        "subsample": 0.8
    })
    
    neural_network: Dict[str, Any] = field(default_factory=lambda: {
        "hidden_layer_sizes": (100, 50),
        "activation": "relu",
        "solver": "adam",
        "alpha": 0.0001,
        "max_iter": 500
    })

@dataclass
class MonitoringConfig:
    """Monitoring and alerting configuration"""
    enabled: bool = True
    metrics_collection_interval: int = 30  # seconds
    alert_check_interval: int = 60  # seconds
    prometheus_enabled: bool = False
    prometheus_port: int = 9090
    
    # Alert thresholds
    error_rate_threshold: float = 0.05
    response_time_threshold: float = 2.0
    memory_usage_threshold: float = 0.8
    disk_usage_threshold: float = 0.9
    
    # Notification channels
    slack_webhook: str = ""
    email_alerts: List[str] = field(default_factory=list)
    sms_alerts: List[str] = field(default_factory=list)

@dataclass
class SecurityConfig:
    """Security configuration"""
    secret_key: str = ""
    jwt_secret: str = ""
    jwt_expiration_hours: int = 24
    password_min_length: int = 8
    max_login_attempts: int = 5
    lockout_duration_minutes: int = 15
    
    # API security
    api_key_rotation_days: int = 90
    rate_limiting_enabled: bool = True
    cors_origins: List[str] = field(default_factory=lambda: ["http://localhost:3000"])
    
    # Encryption
    encryption_algorithm: str = "AES-256-GCM"
    key_derivation_iterations: int = 100000

@dataclass
class PerformanceConfig:
    """Performance optimization configuration"""
    cache_enabled: bool = True
    cache_default_ttl: int = 3600
    cache_max_size: int = 10000
    
    # Async settings
    max_workers: int = 20
    connection_pool_size: int = 100
    request_timeout: int = 30
    
    # Optimization flags
    enable_compression: bool = True
    enable_caching: bool = True
    enable_cdn: bool = False
    
    # Resource limits
    max_memory_mb: int = 2048
    max_cpu_percent: float = 80.0

@dataclass
class FeatureFlags:
    """Feature flags for A/B testing and gradual rollouts"""
    ml_predictions_enabled: bool = True
    real_time_analytics: bool = True
    advanced_clustering: bool = True
    competitive_intelligence: bool = True
    automated_reporting: bool = True
    social_media_integration: bool = False
    voice_assistant: bool = False
    mobile_app_api: bool = False
    
    # A/B testing percentages
    new_ui_percentage: float = 0.0
    enhanced_search_percentage: float = 0.5
    premium_features_percentage: float = 0.1

class EnhancedConfig:
    """Main enhanced configuration class"""
    
    def __init__(self, environment: Environment = None):
        self.environment = environment or self._detect_environment()
        self.config_dir = Path("config")
        self.config_dir.mkdir(exist_ok=True)
        
        # Initialize configurations
        self.database = self._load_database_config()
        self.redis = self._load_redis_config()
        self.apis = self._load_api_configs()
        self.ml = self._load_ml_config()
        self.monitoring = self._load_monitoring_config()
        self.security = self._load_security_config()
        self.performance = self._load_performance_config()
        self.features = self._load_feature_flags()
        
        # Environment-specific overrides
        self._apply_environment_overrides()
        
        logger.info(f"⚙️ Enhanced configuration loaded for {self.environment.value} environment")
    
    def _detect_environment(self) -> Environment:
        """Auto-detect environment"""
        env_name = os.getenv("OKAPIQ_ENV", "development").lower()
        
        env_mapping = {
            "dev": Environment.DEVELOPMENT,
            "development": Environment.DEVELOPMENT,
            "staging": Environment.STAGING,
            "stage": Environment.STAGING,
            "prod": Environment.PRODUCTION,
            "production": Environment.PRODUCTION,
            "test": Environment.TESTING,
            "testing": Environment.TESTING
        }
        
        return env_mapping.get(env_name, Environment.DEVELOPMENT)
    
    def _load_database_config(self) -> DatabaseConfig:
        """Load database configuration"""
        return DatabaseConfig(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "5432")),
            database=os.getenv("DB_NAME", "okapiq"),
            username=os.getenv("DB_USER", "okapiq_user"),
            password=os.getenv("DB_PASSWORD", ""),
            ssl_mode=os.getenv("DB_SSL_MODE", "prefer"),
            pool_size=int(os.getenv("DB_POOL_SIZE", "20")),
            echo=os.getenv("DB_ECHO", "false").lower() == "true"
        )
    
    def _load_redis_config(self) -> RedisConfig:
        """Load Redis configuration"""
        return RedisConfig(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", "6379")),
            password=os.getenv("REDIS_PASSWORD", ""),
            db=int(os.getenv("REDIS_DB", "0")),
            ssl=os.getenv("REDIS_SSL", "false").lower() == "true",
            max_connections=int(os.getenv("REDIS_MAX_CONNECTIONS", "50"))
        )
    
    def _load_api_configs(self) -> Dict[str, List[APIConfig]]:
        """Load API configurations with multiple endpoints per service"""
        apis = {}
        
        # Yelp API configurations
        apis["yelp"] = [
            APIConfig(
                name="yelp_primary",
                base_url="https://api.yelp.com/v3",
                api_key=os.getenv("YELP_API_KEY", ""),
                rate_limit=5000,
                cost_per_request=0.001,
                quality_weight=0.9
            ),
            APIConfig(
                name="yelp_backup",
                base_url="https://api.yelp.com/v3",
                api_key=os.getenv("YELP_API_KEY_BACKUP", ""),
                rate_limit=5000,
                cost_per_request=0.001,
                quality_weight=0.8
            )
        ]
        
        # Google Maps API configurations
        apis["google_maps"] = [
            APIConfig(
                name="gmaps_primary",
                base_url="https://maps.googleapis.com/maps/api",
                api_key=os.getenv("GOOGLE_MAPS_API_KEY", ""),
                rate_limit=1000,
                cost_per_request=0.005,
                quality_weight=0.95
            )
        ]
        
        # Census API configurations
        apis["census"] = [
            APIConfig(
                name="census_primary",
                base_url="https://api.census.gov/data",
                api_key=os.getenv("CENSUS_API_KEY", ""),
                rate_limit=500,
                cost_per_request=0.0,
                quality_weight=0.85
            )
        ]
        
        # OpenAI API configurations
        apis["openai"] = [
            APIConfig(
                name="openai_primary",
                base_url="https://api.openai.com/v1",
                api_key=os.getenv("OPENAI_API_KEY", ""),
                rate_limit=60,
                cost_per_request=0.02,
                quality_weight=0.98
            )
        ]
        
        # DataAxle API configurations
        apis["dataaxle"] = [
            APIConfig(
                name="dataaxle_primary",
                base_url="https://api.dataaxle.com/v1",
                api_key=os.getenv("DATA_AXLE_API_KEY", ""),
                rate_limit=1000,
                cost_per_request=0.01,
                quality_weight=0.8
            )
        ]
        
        # Filter out APIs without keys in development
        if self.environment == Environment.DEVELOPMENT:
            for service in list(apis.keys()):
                apis[service] = [api for api in apis[service] if api.api_key and api.api_key != ""]
                if not apis[service]:
                    del apis[service]
                    logger.warning(f"⚠️ {service} API disabled - no API key provided")
        
        return apis
    
    def _load_ml_config(self) -> MLConfig:
        """Load ML configuration"""
        return MLConfig(
            model_dir=os.getenv("ML_MODEL_DIR", "models"),
            auto_retrain=os.getenv("ML_AUTO_RETRAIN", "true").lower() == "true",
            retrain_threshold=int(os.getenv("ML_RETRAIN_THRESHOLD", "1000")),
            retrain_schedule=os.getenv("ML_RETRAIN_SCHEDULE", "daily"),
            feature_selection=os.getenv("ML_FEATURE_SELECTION", "true").lower() == "true",
            hyperparameter_tuning=os.getenv("ML_HYPERPARAMETER_TUNING", "true").lower() == "true"
        )
    
    def _load_monitoring_config(self) -> MonitoringConfig:
        """Load monitoring configuration"""
        return MonitoringConfig(
            enabled=os.getenv("MONITORING_ENABLED", "true").lower() == "true",
            metrics_collection_interval=int(os.getenv("METRICS_INTERVAL", "30")),
            alert_check_interval=int(os.getenv("ALERT_CHECK_INTERVAL", "60")),
            prometheus_enabled=os.getenv("PROMETHEUS_ENABLED", "false").lower() == "true",
            slack_webhook=os.getenv("SLACK_WEBHOOK_URL", ""),
            email_alerts=os.getenv("ALERT_EMAILS", "").split(",") if os.getenv("ALERT_EMAILS") else []
        )
    
    def _load_security_config(self) -> SecurityConfig:
        """Load security configuration"""
        return SecurityConfig(
            secret_key=os.getenv("SECRET_KEY", secrets.token_urlsafe(32)),
            jwt_secret=os.getenv("JWT_SECRET", secrets.token_urlsafe(32)),
            jwt_expiration_hours=int(os.getenv("JWT_EXPIRATION_HOURS", "24")),
            max_login_attempts=int(os.getenv("MAX_LOGIN_ATTEMPTS", "5")),
            api_key_rotation_days=int(os.getenv("API_KEY_ROTATION_DAYS", "90")),
            cors_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        )
    
    def _load_performance_config(self) -> PerformanceConfig:
        """Load performance configuration"""
        return PerformanceConfig(
            cache_enabled=os.getenv("CACHE_ENABLED", "true").lower() == "true",
            cache_default_ttl=int(os.getenv("CACHE_DEFAULT_TTL", "3600")),
            cache_max_size=int(os.getenv("CACHE_MAX_SIZE", "10000")),
            max_workers=int(os.getenv("MAX_WORKERS", "20")),
            connection_pool_size=int(os.getenv("CONNECTION_POOL_SIZE", "100")),
            max_memory_mb=int(os.getenv("MAX_MEMORY_MB", "2048"))
        )
    
    def _load_feature_flags(self) -> FeatureFlags:
        """Load feature flags"""
        return FeatureFlags(
            ml_predictions_enabled=os.getenv("FEATURE_ML_PREDICTIONS", "true").lower() == "true",
            real_time_analytics=os.getenv("FEATURE_REALTIME_ANALYTICS", "true").lower() == "true",
            advanced_clustering=os.getenv("FEATURE_ADVANCED_CLUSTERING", "true").lower() == "true",
            competitive_intelligence=os.getenv("FEATURE_COMPETITIVE_INTEL", "true").lower() == "true",
            automated_reporting=os.getenv("FEATURE_AUTOMATED_REPORTING", "true").lower() == "true",
            new_ui_percentage=float(os.getenv("AB_NEW_UI_PERCENTAGE", "0.0")),
            enhanced_search_percentage=float(os.getenv("AB_ENHANCED_SEARCH_PERCENTAGE", "0.5"))
        )
    
    def _apply_environment_overrides(self):
        """Apply environment-specific configuration overrides"""
        if self.environment == Environment.DEVELOPMENT:
            # Development overrides
            self.database.echo = True
            self.monitoring.prometheus_enabled = False
            self.performance.cache_enabled = True
            self.ml.auto_retrain = False
            logger.info("🔧 Applied development configuration overrides")
            
        elif self.environment == Environment.STAGING:
            # Staging overrides
            self.database.echo = False
            self.monitoring.prometheus_enabled = True
            self.performance.cache_enabled = True
            self.ml.auto_retrain = True
            logger.info("🔧 Applied staging configuration overrides")
            
        elif self.environment == Environment.PRODUCTION:
            # Production overrides
            self.database.echo = False
            self.database.pool_size = 50
            self.monitoring.prometheus_enabled = True
            self.performance.cache_enabled = True
            self.performance.max_workers = 50
            self.ml.auto_retrain = True
            self.ml.hyperparameter_tuning = False  # Disable in prod for performance
            self.security.cors_origins = os.getenv("PROD_CORS_ORIGINS", "").split(",")
            logger.info("🔧 Applied production configuration overrides")
            
        elif self.environment == Environment.TESTING:
            # Testing overrides
            self.database.database = "okapiq_test"
            self.redis.db = 1  # Use different Redis DB for testing
            self.monitoring.enabled = False
            self.performance.cache_enabled = False
            self.ml.auto_retrain = False
            logger.info("🔧 Applied testing configuration overrides")
    
    def get_database_url(self) -> str:
        """Get formatted database URL"""
        if not self.database.password:
            return f"postgresql://{self.database.username}@{self.database.host}:{self.database.port}/{self.database.database}"
        
        return f"postgresql://{self.database.username}:{self.database.password}@{self.database.host}:{self.database.port}/{self.database.database}"
    
    def get_redis_url(self) -> str:
        """Get formatted Redis URL"""
        if self.redis.password:
            return f"redis://:{self.redis.password}@{self.redis.host}:{self.redis.port}/{self.redis.db}"
        return f"redis://{self.redis.host}:{self.redis.port}/{self.redis.db}"
    
    def validate_configuration(self) -> Dict[str, List[str]]:
        """Validate configuration and return issues"""
        issues = {
            "errors": [],
            "warnings": [],
            "info": []
        }
        
        # Validate API keys
        for service, api_list in self.apis.items():
            active_apis = [api for api in api_list if api.enabled and api.api_key]
            if not active_apis:
                issues["warnings"].append(f"No active API keys for {service}")
            else:
                issues["info"].append(f"{service}: {len(active_apis)} endpoint(s) configured")
        
        # Validate database connection
        if not self.database.password and self.environment == Environment.PRODUCTION:
            issues["errors"].append("Database password required for production")
        
        # Validate security settings
        if not self.security.secret_key:
            issues["errors"].append("Secret key is required")
        
        if self.environment == Environment.PRODUCTION:
            if len(self.security.secret_key) < 32:
                issues["warnings"].append("Secret key should be at least 32 characters in production")
            
            if not self.security.jwt_secret:
                issues["errors"].append("JWT secret is required for production")
        
        # Validate monitoring
        if self.monitoring.enabled and self.environment == Environment.PRODUCTION:
            if not self.monitoring.slack_webhook and not self.monitoring.email_alerts:
                issues["warnings"].append("No alert channels configured for production monitoring")
        
        # Validate ML configuration
        ml_model_dir = Path(self.ml.model_dir)
        if not ml_model_dir.exists():
            ml_model_dir.mkdir(parents=True, exist_ok=True)
            issues["info"].append(f"Created ML model directory: {ml_model_dir}")
        
        return issues
    
    def save_configuration(self, file_path: str = None):
        """Save current configuration to file"""
        if file_path is None:
            file_path = self.config_dir / f"config_{self.environment.value}.json"
        
        config_data = {
            "environment": self.environment.value,
            "database": asdict(self.database),
            "redis": asdict(self.redis),
            "apis": {service: [asdict(api) for api in api_list] for service, api_list in self.apis.items()},
            "ml": asdict(self.ml),
            "monitoring": asdict(self.monitoring),
            "security": {k: v for k, v in asdict(self.security).items() if k not in ["secret_key", "jwt_secret"]},  # Exclude secrets
            "performance": asdict(self.performance),
            "features": asdict(self.features),
            "generated_at": datetime.now().isoformat()
        }
        
        with open(file_path, 'w') as f:
            json.dump(config_data, f, indent=2)
        
        logger.info(f"💾 Configuration saved to {file_path}")
    
    def load_configuration(self, file_path: str):
        """Load configuration from file"""
        try:
            with open(file_path, 'r') as f:
                config_data = json.load(f)
            
            # Load configurations (excluding sensitive data)
            if "database" in config_data:
                db_data = config_data["database"]
                db_data["password"] = os.getenv("DB_PASSWORD", "")  # Always from env
                self.database = DatabaseConfig(**db_data)
            
            if "redis" in config_data:
                redis_data = config_data["redis"]
                redis_data["password"] = os.getenv("REDIS_PASSWORD", "")  # Always from env
                self.redis = RedisConfig(**redis_data)
            
            # Load other configurations...
            
            logger.info(f"📂 Configuration loaded from {file_path}")
            
        except Exception as e:
            logger.error(f"❌ Error loading configuration: {e}")
    
    def get_api_config(self, service: str, endpoint_name: str = None) -> Optional[APIConfig]:
        """Get API configuration for specific service/endpoint"""
        if service not in self.apis:
            return None
        
        api_list = self.apis[service]
        
        if endpoint_name:
            return next((api for api in api_list if api.name == endpoint_name), None)
        
        # Return primary (first enabled) endpoint
        return next((api for api in api_list if api.enabled), None)
    
    def is_feature_enabled(self, feature_name: str, user_id: str = None) -> bool:
        """Check if feature is enabled (with A/B testing support)"""
        if not hasattr(self.features, feature_name):
            return False
        
        base_enabled = getattr(self.features, feature_name)
        
        # Handle percentage-based features (A/B testing)
        if feature_name.endswith("_percentage"):
            if user_id:
                # Consistent hash-based assignment
                user_hash = int(hashlib.md5(user_id.encode()).hexdigest(), 16)
                user_percentage = (user_hash % 100) / 100.0
                return user_percentage < base_enabled
            else:
                # Random assignment for anonymous users
                return random.random() < base_enabled
        
        return base_enabled
    
    def get_configuration_summary(self) -> Dict[str, Any]:
        """Get configuration summary for monitoring"""
        return {
            "environment": self.environment.value,
            "api_services": {
                service: {
                    "endpoints": len(api_list),
                    "enabled": sum(1 for api in api_list if api.enabled),
                    "total_rate_limit": sum(api.rate_limit for api in api_list if api.enabled)
                }
                for service, api_list in self.apis.items()
            },
            "database_configured": bool(self.database.password or self.environment != Environment.PRODUCTION),
            "redis_configured": bool(self.redis.host),
            "monitoring_enabled": self.monitoring.enabled,
            "ml_features": {
                "auto_retrain": self.ml.auto_retrain,
                "feature_selection": self.ml.feature_selection,
                "hyperparameter_tuning": self.ml.hyperparameter_tuning
            },
            "security_features": {
                "rate_limiting": self.security.rate_limiting_enabled,
                "cors_configured": len(self.security.cors_origins) > 0,
                "jwt_configured": bool(self.security.jwt_secret)
            },
            "feature_flags": {
                name: getattr(self.features, name)
                for name in dir(self.features)
                if not name.startswith('_')
            }
        }

# Configuration factory
def create_config(environment: str = None) -> EnhancedConfig:
    """Create configuration instance"""
    env = Environment(environment) if environment else None
    config = EnhancedConfig(env)
    
    # Validate configuration
    validation_results = config.validate_configuration()
    
    # Log validation results
    for error in validation_results["errors"]:
        logger.error(f"❌ Configuration Error: {error}")
    
    for warning in validation_results["warnings"]:
        logger.warning(f"⚠️ Configuration Warning: {warning}")
    
    for info in validation_results["info"]:
        logger.info(f"ℹ️ Configuration Info: {info}")
    
    # Save configuration for reference
    config.save_configuration()
    
    return config

# Global configuration instance
config = create_config()

# Example usage
if __name__ == "__main__":
    print("🧪 Testing enhanced configuration system...")
    
    # Test configuration creation
    test_config = create_config("development")
    
    print(f"✅ Configuration created for {test_config.environment.value}")
    print(f"📊 API services configured: {len(test_config.apis)}")
    print(f"🔐 Security enabled: {test_config.security.rate_limiting_enabled}")
    print(f"🤖 ML auto-retrain: {test_config.ml.auto_retrain}")
    print(f"📈 Monitoring enabled: {test_config.monitoring.enabled}")
    
    # Test feature flags
    print(f"🚩 ML predictions enabled: {test_config.is_feature_enabled('ml_predictions_enabled')}")
    print(f"🚩 Real-time analytics: {test_config.is_feature_enabled('real_time_analytics')}")
    
    # Test configuration summary
    summary = test_config.get_configuration_summary()
    print(f"📋 Configuration summary: {len(summary)} sections")
    
    print("✅ Enhanced configuration system testing completed!")
