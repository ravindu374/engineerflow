from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.db.deps import get_db
from app.services.auth_service import AuthService

router = APIRouter()
auth_service = AuthService()


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    print("LOGIN SECRET:", settings.jwt_secret)
    try:
        return await auth_service.login(
            db,
            form_data.username,
            form_data.password,
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid credentials")