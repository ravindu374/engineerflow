from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings


client = AsyncIOMotorClient(settings.mongo_url)

mongo_db = client["engineerflow"]
activity_collection = mongo_db["activity_logs"]