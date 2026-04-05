from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repository import UserRepository
from app.core.security import verify_password
from app.core.jwt import create_access_token


class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def authenticate_user(self, db: AsyncSession, email: str, password: str):
        user = await self.user_repo.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user

    async def login(self, db: AsyncSession, email: str, password: str):
        user = await self.authenticate_user(db, email, password)

        if not user:
            raise ValueError("Invalid credentials")

        token = create_access_token(
            {"sub": str(user.id)}
        )

        return {"access_token": token, "token_type": "bearer"}