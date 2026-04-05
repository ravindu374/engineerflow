from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate, ProjectResponse
from app.core.deps import get_current_user

router = APIRouter()
project_service = ProjectService()


@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    project_data = project.model_dump()

    # enforce ownership
    project_data["owner_id"] = current_user.id

    return await project_service.create_project(db, project_data,current_user.email)