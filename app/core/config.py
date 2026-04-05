from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    project_name: str
    postgres_url: str
    mongo_url: str
    redis_url: str

    jwt_secret: str
    jwt_algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"


settings = Settings()