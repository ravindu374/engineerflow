from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate, TaskResponse
from app.core.deps import get_current_user
from app.repositories.project_repository import ProjectRepository

router = APIRouter()
task_service = TaskService()
project_repo = ProjectRepository()


@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # check project ownership
    project = await project_repo.get(db, task.project_id)

    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await task_service.create_task(db, task.model_dump())