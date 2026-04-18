"""
Application configuration.
Pydantic settings with environment variable support.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # === Application ===
    APP_NAME: str = "LabelFlow API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development | staging | production

    # === Database ===
    DATABASE_URL: str = "postgresql+asyncpg://annotation_user:annotation_pass@localhost:5432/annotation_db"

    # === Redis ===
    REDIS_URL: str = "redis://localhost:6379"

    # === S3 Storage ===
    S3_ENDPOINT: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_BUCKET: str = "annotation-assets"
    S3_REGION: str = "us-east-1"

    # === Auth ===
    SECRET_KEY: str = "change-me-in-production"
    NEXTAUTH_URL: str = "http://localhost:3000"
    NEXTAUTH_SECRET: str = "change-me-in-production"

    # === CORS ===
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # === Celery ===
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    # === ML Inference ===
    SAM3_MODEL_PATH: Optional[str] = None
    CUDA_DEVICE: str = "cuda:0"  # cuda:0 | cpu

    # === Rate Limiting ===
    RATE_LIMIT_PER_MINUTE: int = 60


settings = Settings()