from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Inversion of Control via Pydantic Settings.
    Guarantees fast-fail if infrastructure or database keys are missing on Railway.
    """
    environment: str = "development"
    
    # LLM Settings
    llm_provider: str = "openai"
    llm_model: str = "gemini-1.5-flash"  # Default generic model config if not mapped
    openai_model: str = "gpt-4o-mini"
    gemini_model: str = "gemini-1.5-flash"
    ollama_model: str = "llama3.2"
    ollama_base_url: str = "http://localhost:11434"

    # Credentials (fail fast if absent when required)
    openai_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None

    # Database Settings
    neo4j_uri: str
    neo4j_user: str = "neo4j"
    neo4j_password: str
    neo4j_database: str = "neo4j"

    # Security Settings
    frontend_url: str = "*"  # CSV list of allowed origins. E.g.: "https://portfolio.com,https://api.com"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # Ignore extra Railway env vars unrelated to this API
    )
    
    @property
    def cors_origins(self) -> List[str]:
        if self.frontend_url == "*":
            return ["*"]
        return [url.strip() for url in self.frontend_url.split(",")]

settings = Settings()
