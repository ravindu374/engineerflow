from datetime import datetime
import pytz

from app.db.mongo import activity_collection

class ActivityService:
    async def log_activity(self, user_id: str, action: str, details: dict):
        try:
            await activity_collection.insert_one(
                {
                    "user_id": user_id,
                    "action": action,
                    "details": details,
                    "timestamp": datetime.now(pytz.timezone("Asia/Colombo")),
                }
            )
        except Exception as e:
            print("MongoDB log failed:", e)