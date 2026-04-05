from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repository import UserRepository
from app.core.security import hash_password


class UserService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def create_user(self, db: AsyncSession, user_data: dict):
        # Check if email already exists
        existing_user = await self.user_repo.get_by_email(
            db, user_data["email"]
        )
        if existing_user:
            raise ValueError("Email already registered")

        # Hash password
        user_data["hashed_password"] = hash_password(user_data["password"])
        del user_data["password"]

        return await self.user_repo.create(db, user_data)

    async def get_user(self, db: AsyncSession, user_id):
        return await self.user_repo.get(db, user_id)