from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()
user_service = UserService()


@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    created_user = await user_service.create_user(db, user.model_dump())
    return created_user