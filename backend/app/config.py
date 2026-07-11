from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./typeform.db"
    APP_NAME: str = "Typeform Clone API"
    DEBUG: bool = True
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        """Split CORS_ORIGINS by comma into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    model_config = {
        "env_file": ".env",
    }


settings = Settings()
