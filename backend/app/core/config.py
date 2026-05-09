"""Application configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    DATABASE_URL: str = "sqlite:///./test.db"
    API_TITLE: str = "Weddingbellodisha Studio Management API"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = True
    SECRET_KEY: str = "weddingbellodisha-secret-key-change-in-production"
    
    class Config:
        env_file = ".env"


settings = Settings()
