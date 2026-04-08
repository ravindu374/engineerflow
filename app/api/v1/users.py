from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.core.deps import get_current_user
from fastapi import Depends
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

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
    }